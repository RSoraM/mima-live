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
  <KitDivider class="divider-start">
    # Step 0: Choose Curve
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormSelectCurve v-model="curve" title="" class="w-full" />
  </div>
  <KitDivider class="divider-start">
    # Step 1: Choose Hash Algorithm
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormSelectHash v-model="hash" title="" class="w-full" />
  </div>
  <KitDivider class="divider-start">
    # Step 2: Key Generation
  </KitDivider>
  <div class="border-l pl-4">
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
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="key.$reset()">
        Clear
      </KitButton>
      <KitButton @click="key.gen()">
        Generate
      </KitButton>
    </div>
  </div>
  <KitDivider class="divider-start">
    # Step 3: Signature
  </KitDivider>
  <div class="border-l pl-4">
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
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="sign()">
        Sign
      </KitButton>
      <KitButton @click="verify()">
        Verify
      </KitButton>
    </div>
  </div>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
