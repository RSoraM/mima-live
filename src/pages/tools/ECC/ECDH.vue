<script setup lang="ts">
import { FpECC, HEX, secp256r1, U8 } from 'mima-kit';

interface ECCKeypair {
  d: string;
  Q: {
    isInfinity: boolean;
    x: string;
    y: string;
  };
}

const curve = ref(secp256r1);
const ec = computed(() => FpECC(curve.value));
const codec = ref(HEX);
const k_a = ref<ECCKeypair>({
  d: '',
  Q: {
    isInfinity: true,
    x: '',
    y: '',
  },
});
const k_a_raw = computed(() => ({
  d: codec.value(k_a.value.d).toBI(),
  Q: {
    isInfinity: k_a.value.Q.isInfinity,
    x: codec.value(k_a.value.Q.x).toBI(),
    y: codec.value(k_a.value.Q.y).toBI(),
  },
}));
const k_b = ref<ECCKeypair>({
  d: '',
  Q: {
    isInfinity: true,
    x: '',
    y: '',
  },
});
const k_b_raw = computed(() => ({
  d: codec.value(k_b.value.d).toBI(),
  Q: {
    isInfinity: k_b.value.Q.isInfinity,
    x: codec.value(k_b.value.Q.x).toBI(),
    y: codec.value(k_b.value.Q.y).toBI(),
  },
}));
const ecdh_s_a = ref('');
const ecdh_s_a_bits = computed(() => getBIBits(codec.value(ecdh_s_a.value).toBI()));
const ecdh_s_b = ref('');
const ecdh_s_b_bits = computed(() => getBIBits(codec.value(ecdh_s_b.value).toBI()));
const eccdh_s_a = ref('');
const eccdh_s_a_bits = computed(() => getBIBits(codec.value(eccdh_s_a.value).toBI()));
const eccdh_s_b = ref('');
const eccdh_s_b_bits = computed(() => getBIBits(codec.value(eccdh_s_b.value).toBI()));
const isSAComputeAble = computed(() => {
  const t = [k_a.value.d, k_b.value.Q.x, k_b.value.Q.y];
  return t.every(v => v !== '');
});
const isSBComputeAble = computed(() => {
  const t = [k_b.value.d, k_a.value.Q.x, k_a.value.Q.y];
  return t.every(v => v !== '');
});
function genKey() {
  clearKey();
  const now = performance.now();
  const keypair = ec.value.genKey();
  const end = performance.now();
  $notify({
    title: 'Key generated',
    message: `Time: ${(end - now).toFixed(2)} ms`,
    type: 'success',
  });
  return {
    d: codec.value(U8.fromBI(keypair.d)),
    Q: {
      isInfinity: keypair.Q.isInfinity || false,
      x: codec.value(U8.fromBI(keypair.Q.x)),
      y: codec.value(U8.fromBI(keypair.Q.y)),
    },
  };
}
function clearKey() {
  ecdh_s_a.value = '';
  eccdh_s_a.value = '';
  ecdh_s_b.value = '';
  eccdh_s_b.value = '';
  return {
    d: '',
    Q: {
      isInfinity: true,
      x: '',
      y: '',
    },
  };
}
function ecdh(k_a: typeof k_b_raw.value, k_b: typeof k_b_raw.value) {
  return U8.fromBI(ec.value.ecdh(k_a, k_b).x).to(codec.value);
}
function eccdh(k_a: typeof k_b_raw.value, k_b: typeof k_b_raw.value) {
  return U8.fromBI(ec.value.eccdh(k_a, k_b).x).to(codec.value);
}
watch(codec, (new_codec, old_codec) => {
  k_a.value = {
    d: new_codec(old_codec(k_a.value.d)),
    Q: {
      isInfinity: k_a.value.Q.isInfinity,
      x: new_codec(old_codec(k_a.value.Q.x)),
      y: new_codec(old_codec(k_a.value.Q.y)),
    },
  };
  k_b.value = {
    d: new_codec(old_codec(k_b.value.d)),
    Q: {
      isInfinity: k_b.value.Q.isInfinity,
      x: new_codec(old_codec(k_b.value.Q.x)),
      y: new_codec(old_codec(k_b.value.Q.y)),
    },
  };
});
watch(curve, () => {
  k_a.value = clearKey();
  k_b.value = clearKey();
});

k_a.value = genKey();
k_b.value = genKey();
ecdh_s_a.value = ecdh(k_a_raw.value, k_b_raw.value);
ecdh_s_b.value = ecdh(k_b_raw.value, k_a_raw.value);
eccdh_s_a.value = eccdh(k_a_raw.value, k_b_raw.value);
eccdh_s_b.value = eccdh(k_b_raw.value, k_a_raw.value);
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      ECDH / ECCDH
    </h1>
    <KitFormCurveSelect v-model="curve" />
    <KitFormControl title="Codec">
      <KitBaseFormCodecSelect v-model="codec" />
    </KitFormControl>
    <div class="divider my-8">
      Key Exchange
    </div>
    <!-- Alice -->
    <details class="collapse collapse-plus bg-base-200" open>
      <summary class="collapse-title text-lg font-bold">
        Alice
      </summary>
      <div class="collapse-content pt-4">
        <div class="divider mb-8">
          <button class="btn btn-outline btn-sm" @click="k_a = genKey()">
            Generate
          </button>
          /
          <button class="btn btn-outline btn-sm" @click="k_a = clearKey()">
            Clear
          </button>
        </div>
        <KitFormInput v-model="k_a.d" :title="`Private key dA: (${getBIBits(k_a_raw.d)} bit)`" />
        <KitFormPointCompress
          v-model:curve="curve"
          v-model:p="k_a.Q"
          v-model:codec="codec"
          title="Public key QA"
        />
        <div class="divider my-8">
          <button :disabled="!isSAComputeAble" class="btn btn-outline btn-sm" @click="eccdh_s_a = eccdh(k_a_raw, k_b_raw)">
            ECCDH
          </button>/
          <button :disabled="!isSAComputeAble" class="btn btn-outline btn-sm" @click="ecdh_s_a = ecdh(k_a_raw, k_b_raw)">
            ECDH
          </button>
        </div>
        <KitFormInput v-model="ecdh_s_a" :title="`S = (dA * QB).x: (${ecdh_s_a_bits} bit)`" />
        <KitFormInput v-model="eccdh_s_a" :title="`S = (dA * QB * h).x: (${eccdh_s_a_bits} bit)`" />
      </div>
    </details>
    <!-- Bob -->
    <details class="collapse collapse-plus mt-4 bg-base-200" open>
      <summary class="collapse-title text-lg font-bold">
        Bob
      </summary>
      <div class="collapse-content pt-4">
        <div class="divider mb-8">
          <button class="btn btn-outline btn-sm" @click="k_b = genKey()">
            Generate
          </button>
          /
          <button class="btn btn-outline btn-sm" @click="k_b = clearKey()">
            Clear
          </button>
        </div>
        <KitFormInput v-model="k_b.d" :title="`Private key dB: (${getBIBits(k_b_raw.d)} bit)`" />
        <KitFormPointCompress
          v-model:curve="curve"
          v-model:p="k_b.Q"
          v-model:codec="codec"
          title="Public key QB"
        />
        <div class="divider my-8">
          <button :disabled="!isSBComputeAble" class="btn btn-outline btn-sm" @click="eccdh_s_b = eccdh(k_b_raw, k_a_raw)">
            ECCDH
          </button>/
          <button :disabled="!isSBComputeAble" class="btn btn-outline btn-sm" @click="ecdh_s_b = ecdh(k_b_raw, k_a_raw)">
            ECDH
          </button>
        </div>
        <KitFormInput v-model="ecdh_s_b" :title="`S = (dB * QA).x: (${ecdh_s_b_bits} bit)`" />
        <KitFormInput v-model="eccdh_s_b" :title="`S = (dB * QA * h).x: (${eccdh_s_b_bits} bit)`" />
      </div>
    </details>

    <!-- Curve Parameters -->
    <div class="divider my-8">
      Curve Parameters
    </div>
    <KitCurveTable :curve="curve" :codec="codec" />
  </div>
</template>
