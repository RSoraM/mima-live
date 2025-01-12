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
  <ToolsLayout title="ECDSA">
    <KitFoldCard title="0: Elliptic Curve" :open="false">
      <KitFormSelectCurve v-model="curve" class="w-full" />
    </KitFoldCard>
    <KitFoldCard title="1: Hash Algorithm" :open="false">
      <KitFormSelectHash v-model="hash" class="w-full" />
    </KitFoldCard>
    <KitFoldCard title="2: Key Pair" :open="false">
      <template #action>
        <KitButton @click="key.$reset()">
          Clear
        </KitButton>
        <KitButton @click="key.gen()">
          Generate
        </KitButton>
      </template>
      <ul class="mb-2 ml-6 list-disc text-xs">
        <li>PrivateKey <b><u>d</u></b>.</li>
        <li>PublicKey <b><u>Q</u></b>.</li>
      </ul>
      <KitFormU8 v-model="key.d" :title="`d (${key.d_bit} bit)`" :codec="HEX" />
      <KitFormECCPoint
        v-model="key.Q" :curve="curve"
        :x-bit="key.x_bit" :y-bit="key.y_bit"
        name="Q"
      />
    </KitFoldCard>
    <KitFoldCard title="3: Signature" :open="false">
      <template #action>
        <KitButton @click="verify()">
          Verify
        </KitButton>
        <KitButton @click="sign()">
          Sign
        </KitButton>
      </template>
      <KitFormU8 v-model="M" title="Input" textarea :codec="UTF8" />
      <KitFormU8 v-model="R" :title="`Signature r (${getBIBits(R.toBI())} bit)`" :codec="HEX" />
      <KitFormU8 v-model="S" :title="`Signature s (${getBIBits(S.toBI())} bit)`" :codec="HEX" />
    </KitFoldCard>

    <!-- Curve Parameters -->
    <KitFoldCard title="Appendix: Curve Parameters" :open="false">
      <KitCurveTable :curve="curve" :codec="HEX" />
    </KitFoldCard>
  </ToolsLayout>
</template>
