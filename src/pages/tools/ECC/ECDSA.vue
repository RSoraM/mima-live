<script setup lang="ts">
defineOptions({ name: 'ECMQV' });

const curve = ref(secp256r1);
const ec = computed(() => FpECC(curve.value));
const key = ref({
  d: 0n,
  Q: {
    isInfinity: true,
    x: 0n,
    y: 0n,
  },
});
const M = ref(UTF8('mima-kit'));
const S = ref(0n);
const R = ref(0n);
const hash = ref(sha256);
const sign = catchNotify(() => {
  const dsa = ec.value.ecdsa(hash.value);
  const sign = dsa.sign(key.value, M.value);
  S.value = sign.s;
  R.value = sign.r;
});
const verify = catchNotify(() => {
  const dsa = ec.value.ecdsa(hash.value);
  const sign = { r: R.value, s: S.value };
  if (dsa.verify(key.value, M.value, sign)) {
    $notify({
      title: 'Verification',
      message: 'Verification success',
      type: 'success',
    });
  }
  else {
    throw new Error('Verification failed');
  }
});

watch(
  curve,
  catchNotifySync(() => {
    R.value = 0n;
    S.value = 0n;
  }),
);
onMounted(() => nextTick(() => sign()));
</script>

<template>
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    ECDSA
  </h1>
  <KitFormSelectCurve v-model="curve" />
  <KitFormSelectHash v-model="hash" title="Hash" />
  <!-- Key Generation -->
  <KitFormECKey
    v-model="key"
    :curve="curve"
    :fold="true"
  />
  <!-- Signature -->
  <KitDivider>
    <KitButton @click="sign()">
      sign
    </KitButton>/
    <KitButton @click="verify()">
      verify
    </KitButton>
  </KitDivider>
  <KitFormU8
    v-model="M"
    :codec="UTF8"
    title="Input"
    textarea
  />
  <KitFormBigint
    v-model="R"
    :title="`Signature r (${getBIBits(R)} bit)`"
  />
  <KitFormBigint
    v-model="S"
    :title="`Signature s (${getBIBits(S)} bit)`"
  />

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
