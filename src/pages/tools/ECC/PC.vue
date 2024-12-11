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
const k = ref<ECCKeypair>({
  d: '',
  Q: {
    isInfinity: true,
    x: '',
    y: '',
  },
});
const k_raw = computed(() => {
  return {
    d: codec.value(k.value.d).toBI(),
    Q: {
      isInfinity: k.value.Q.isInfinity,
      x: codec.value(k.value.Q.x).toBI(),
      y: codec.value(k.value.Q.y).toBI(),
    },
  };
});
function genKey() {
  clearKey();
  const keypair = ec.value.genKey();
  k.value = {
    d: U8.fromBI(keypair.d).to(codec.value),
    Q: {
      isInfinity: keypair.Q.isInfinity || false,
      x: U8.fromBI(keypair.Q.x).to(codec.value),
      y: U8.fromBI(keypair.Q.y).to(codec.value),
    },
  };
}
function clearKey() {
  k.value = {
    d: '',
    Q: {
      isInfinity: true,
      x: '',
      y: '',
    },
  };
}
watch(codec, (new_codec, old_codec) => {
  k.value = {
    d: new_codec(old_codec(k.value.d)),
    Q: {
      isInfinity: k.value.Q.isInfinity,
      x: new_codec(old_codec(k.value.Q.x)),
      y: new_codec(old_codec(k.value.Q.y)),
    },
  };
});
watch(curve, () => {
  clearKey();
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      Point Compress
    </h1>
    <KitFormCurveSelect v-model="curve" />
    <KitFormControl title="Codec">
      <KitBaseFormCodecSelect v-model="codec" />
    </KitFormControl>
    <!-- Key Generation -->
    <div class="divider my-8">
      <button class="btn btn-outline btn-sm" @click="clearKey()">
        Clear
      </button>/
      <button class="btn btn-outline btn-sm" @click="genKey()">
        Generate
      </button>
    </div>
    <KitFormInput v-model="k.d" :title="`Private Key d: (${getBIBits(k_raw.d)} bit)`" />
    <KitFormPointCompress
      v-model:curve="curve"
      v-model:p="k.Q"
      v-model:codec="codec"
      title="Public Key Q"
      :fold="false"
    />

    <!-- Curve Parameters -->
    <div class="divider my-8">
      Curve Parameters
    </div>
    <KitCurveTable :curve="curve" :codec="codec" />
  </div>
</template>
