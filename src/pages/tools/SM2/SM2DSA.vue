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
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    SM2-DSA
  </h1>
  <KitDivider class="divider-start">
    # Step 0: Choose Curve
  </KitDivider>
  <KitFormSelectCurve v-model="curve" title="" />
  <KitDivider class="divider-start">
    # Step 1: Choose Hash Algorithm
  </KitDivider>
  <KitFormSelectHash v-model="hash" title="" />
  <KitDivider class="divider-start">
    # Step 2: Key Generation
  </KitDivider>
  <div class="border-l pl-4">
    <div class="flex justify-center gap-4 pb-4">
      <KitButton @click="key.$reset()">
        Clear
      </KitButton>
      <KitButton @click="key.gen()">
        Generate
      </KitButton>
    </div>
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
  </div>
  <KitDivider class="divider-start">
    # Step 3: User Identifier
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormU8
      v-model="ID" :codec="UTF8"
      :immediate="true"
      title="ID"
    />
    <KitFormU8
      v-model="DI"
      :codec="HEX"
      :title="`Identifier (${getBIBits(DI.toBI())} bit)`"
    />
  </div>
  <KitDivider class="divider-start">
    # Step 4: Signature
  </KitDivider>
  <div class="border-l pl-4">
    <div class="flex justify-center gap-4 pb-4">
      <KitButton @click="sign()">
        sign
      </KitButton>
      <KitButton @click="verify()">
        verify
      </KitButton>
    </div>
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
  </div>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
