<script setup lang="ts">
defineOptions({ name: 'SM2DSA' });

const key = useSM2Key();
key.gen();
const { curve } = storeToRefs(key);
const ec = computed(() => sm2(curve.value));
const hash = ref(sm3);

const ID = ref(UTF8('rsm@mima.kit'));
const DI = computed(() => ec.value.di(ID.value, key, hash.value));

const M = ref(UTF8('mima-kit'));
const R = ref(new U8());
const S = ref(new U8());

const sign = catchNotify(() => {
  const signer = ec.value.dsa(hash.value);
  const sign = signer.sign(DI.value, key, M.value);
  S.value = sign.s;
  R.value = sign.r;
});
const verify = catchNotify(() => {
  const signer = ec.value.dsa(hash.value);
  const sign = { r: R.value, s: S.value };
  if (signer.verify(DI.value, key, M.value, sign)) {
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
  catchNotifySync(() => key.$reset()),
);

onMounted(async () => sign());
</script>

<template>
  <ToolsLayout title="SM2-DSA">
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
      <KitFormU8
        v-model="key.d" :codec="HEX"
        :title="`Private Key dA (${key.d_bit} bit)`"
      />
      <KitFormECCPoint
        v-model="key.Q" :curve="curve"
        :x-bit="key.x_bit" :y-bit="key.y_bit"
        name="Public Key QA"
      />
    </KitFoldCard>
    <KitFoldCard title="3: User Identifier" :open="false">
      <KitFormU8 v-model="ID" title="ID" :immediate="true" :codec="UTF8" />
      <KitFormU8 v-model="DI" title="Identifier" :codec="HEX" />
    </KitFoldCard>
    <KitFoldCard title="4: Signature" :open="false">
      <template #action>
        <KitButton @click="sign()">
          sign
        </KitButton>
        <KitButton @click="verify()">
          verify
        </KitButton>
      </template>
      <KitFormU8
        v-model="M" :codec="UTF8"
        title="Input"
        textarea
      />
      <KitFormU8
        v-model="R" :codec="HEX"
        :title="`Signature r (${getBIBits(R.toBI())} bit)`"
      />
      <KitFormU8
        v-model="S" :codec="HEX"
        :title="`Signature s (${getBIBits(S.toBI())} bit)`"
      />
    </KitFoldCard>

    <!-- Curve Parameters -->
    <KitFoldCard title="Appendix: Curve Parameters" :open="false">
      <KitCurveTable :curve="curve" :codec="HEX" />
    </KitFoldCard>
  </ToolsLayout>
</template>
