<script setup lang="ts">
import { HEX, secp256r1 } from 'mima-kit';

const curve = ref(secp256r1);
const codec = ref(HEX);
const key = ref({
  d: 0n,
  Q: {
    isInfinity: true,
    x: 0n,
    y: 0n,
  },
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      Key Generation
    </h1>
    <KitFormCurveSelect v-model="curve" />
    <KitFormECKey
      v-model="key"
      :curve="curve"
      :fold="false"
    />

    <!-- Curve Parameters -->
    <div class="divider my-8">
      Curve Parameters
    </div>
    <KitCurveTable :curve="curve" :codec="codec" />
  </div>
</template>
