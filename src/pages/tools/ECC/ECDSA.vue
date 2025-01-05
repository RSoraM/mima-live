<script setup lang="ts">
defineOptions({ name: 'ECMQV' });

const key = useECCKey();
const { curve } = storeToRefs(key);
const ec = computed(() => FpECC(curve.value));
const M = ref(UTF8('mima-kit'));
const S = ref(new U8());
const R = ref(new U8());
const hash = ref(sha256);
const sign = catchNotify(() => {
  const signer = ec.value.dsa(hash.value);
  const sign = signer.sign(key, M.value);
  S.value = sign.s;
  R.value = sign.r;
});
const verify = catchNotify(() => {
  const signer = ec.value.dsa(hash.value);
  const sign = { r: R.value, s: S.value };
  if (signer.verify(key, M.value, sign)) {
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
    R.value = new U8();
    S.value = new U8();
  }),
);
onMounted(() => nextTick(() => {
  key.gen();
  sign();
}));
</script>

<template>
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    ECDSA
  </h1>
  <KitFormSelectCurve v-model="curve" />
  <KitFormSelectHash v-model="hash" title="Hash" />
  <!-- Key Generation -->
  <KitDivider>
    <KitButton @click="key.$reset()">
      Clear
    </KitButton>
    <KitButton @click="key.gen()">
      Generate
    </KitButton>
  </KitDivider>
  <KitFormU8
    v-model="key.d"
    :codec="HEX"
    :title="`Private Key dA (${key.d_bit} bit)`"
  />
  <KitFormECCPoint
    v-model="key.Q"
    :curve="curve"
    name="Public Key QA"
    :x-bit="key.x_bit"
    :y-bit="key.y_bit"
  />
  <!-- Signature -->
  <KitDivider>
    <KitButton @click="sign()">
      sign
    </KitButton>
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
  <KitFormU8
    v-model="R"
    :codec="HEX"
    :title="`Signature r (${getBIBits(R.toBI())} bit)`"
  />
  <KitFormU8
    v-model="S"
    :codec="HEX"
    :title="`Signature s (${getBIBits(S.toBI())} bit)`"
  />

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
