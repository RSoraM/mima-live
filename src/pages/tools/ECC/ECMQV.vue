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
const k_a_raw = computed(() => {
  return {
    d: codec.value(k_a.value.d).toBI(),
    Q: {
      isInfinity: k_a.value.Q.isInfinity,
      x: codec.value(k_a.value.Q.x).toBI(),
      y: codec.value(k_a.value.Q.y).toBI(),
    },
  };
});
const k_x = ref<ECCKeypair>({
  d: '',
  Q: {
    isInfinity: true,
    x: '',
    y: '',
  },
});
const k_x_raw = computed(() => {
  return {
    d: codec.value(k_x.value.d).toBI(),
    Q: {
      isInfinity: k_x.value.Q.isInfinity,
      x: codec.value(k_x.value.Q.x).toBI(),
      y: codec.value(k_x.value.Q.y).toBI(),
    },
  };
});
const k_b = ref<ECCKeypair>({
  d: '',
  Q: {
    isInfinity: true,
    x: '',
    y: '',
  },
});
const k_b_raw = computed(() => {
  return {
    d: codec.value(k_b.value.d).toBI(),
    Q: {
      isInfinity: k_b.value.Q.isInfinity,
      x: codec.value(k_b.value.Q.x).toBI(),
      y: codec.value(k_b.value.Q.y).toBI(),
    },
  };
});
const k_y = ref<ECCKeypair>({
  d: '',
  Q: {
    isInfinity: true,
    x: '',
    y: '',
  },
});
const k_y_raw = computed(() => {
  return {
    d: codec.value(k_y.value.d).toBI(),
    Q: {
      isInfinity: k_y.value.Q.isInfinity,
      x: codec.value(k_y.value.Q.x).toBI(),
      y: codec.value(k_y.value.Q.y).toBI(),
    },
  };
});
const s_a = ref('');
const s_a_bits = computed(() => getBIBits(codec.value(s_a.value).toBI()));
const s_b = ref('');
const s_b_bits = computed(() => getBIBits(codec.value(s_b.value).toBI()));
const isSAComputeAble = computed(() => {
  const t = [
    k_a.value.d,
    k_a.value.Q.x,
    k_a.value.Q.y,
    k_x.value.d,
    k_x.value.Q.x,
    k_x.value.Q.y,
    k_b.value.Q.x,
    k_b.value.Q.y,
    k_y.value.Q.x,
    k_y.value.Q.y,
  ];
  return t.every(v => v !== '');
});
const isSBComputeAble = computed(() => {
  const t = [
    k_b.value.d,
    k_b.value.Q.x,
    k_b.value.Q.y,
    k_y.value.d,
    k_y.value.Q.x,
    k_y.value.Q.y,
    k_a.value.Q.x,
    k_a.value.Q.y,
    k_x.value.Q.x,
    k_x.value.Q.y,
  ];
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
  s_a.value = '';
  s_b.value = '';
  return {
    d: '',
    Q: {
      isInfinity: true,
      x: '',
      y: '',
    },
  };
}
function ecmqv(k_a_1: typeof k_b_raw.value, k_a_2: typeof k_b_raw.value, k_b_1: typeof k_b_raw.value, k_b_2: typeof k_b_raw.value) {
  return U8.fromBI(ec.value.ecmqv(k_a_1, k_a_2, k_b_1, k_b_2).x).to(codec.value);
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
  k_x.value = {
    d: new_codec(old_codec(k_x.value.d)),
    Q: {
      isInfinity: k_x.value.Q.isInfinity,
      x: new_codec(old_codec(k_x.value.Q.x)),
      y: new_codec(old_codec(k_x.value.Q.y)),
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
  k_y.value = {
    d: new_codec(old_codec(k_y.value.d)),
    Q: {
      isInfinity: k_y.value.Q.isInfinity,
      x: new_codec(old_codec(k_y.value.Q.x)),
      y: new_codec(old_codec(k_y.value.Q.y)),
    },
  };
});
watch(curve, () => {
  k_a.value = clearKey();
  k_x.value = clearKey();
  k_b.value = clearKey();
  k_y.value = clearKey();
});

k_a.value = genKey();
k_x.value = genKey();
k_b.value = genKey();
k_y.value = genKey();

s_a.value = ecmqv(k_a_raw.value, k_x_raw.value, k_b_raw.value, k_y_raw.value);
s_b.value = ecmqv(k_b_raw.value, k_y_raw.value, k_a_raw.value, k_x_raw.value);
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      ECMQV
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
          Key A :
          <button class="btn btn-outline btn-sm" @click="k_a = genKey()">
            Generate
          </button>/
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
          Key X :
          <button class="btn btn-outline btn-sm" @click="k_x = genKey()">
            Generate
          </button>/
          <button class="btn btn-outline btn-sm" @click="k_x = clearKey()">
            Clear
          </button>
        </div>
        <KitFormInput v-model="k_x.d" :title="`Private key dX: (${getBIBits(k_x_raw.d)} bit)`" />
        <KitFormPointCompress
          v-model:curve="curve"
          v-model:p="k_x.Q"
          v-model:codec="codec"
          title="Public key QX"
        />
        <div class="divider my-8">
          <button :disabled="!isSAComputeAble" class="btn btn-outline btn-sm" @click="s_a = ecmqv(k_a_raw, k_x_raw, k_b_raw, k_y_raw)">
            ECMQV
          </button>
        </div>
        <KitFormInput v-model="s_a" :title="`S (${s_a_bits} bit)`" />
      </div>
    </details>
    <!-- Bob -->
    <details class="collapse collapse-plus mt-4 bg-base-200" open>
      <summary class="collapse-title text-lg font-bold">
        Bob
      </summary>
      <div class="collapse-content pt-4">
        <div class="divider mb-8">
          Key B :
          <button class="btn btn-outline btn-sm" @click="k_b = genKey()">
            Generate
          </button>/
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
          Key Y :
          <button class="btn btn-outline btn-sm" @click="k_y = genKey()">
            Generate
          </button>/
          <button class="btn btn-outline btn-sm" @click="k_y = clearKey()">
            Clear
          </button>
        </div>
        <KitFormInput v-model="k_y.d" :title="`Private key dY: (${getBIBits(k_y_raw.d)} bit)`" />
        <KitFormPointCompress
          v-model:curve="curve"
          v-model:p="k_y.Q"
          v-model:codec="codec"
          title="Public key QY"
        />
        <div class="divider my-8">
          <button
            :disabled="!isSBComputeAble" class="btn btn-outline btn-sm"
            @click="s_b = ecmqv(k_b_raw, k_y_raw, k_a_raw, k_x_raw)"
          >
            ECMQV
          </button>
        </div>
        <KitFormInput v-model="s_b" :title="`S (${s_b_bits} bit)`" />
      </div>
    </details>

    <!-- Curve Parameters -->
    <div class="divider my-8">
      Curve Parameters
    </div>
    <KitCurveTable :curve="curve" :codec="codec" />
  </div>
</template>
