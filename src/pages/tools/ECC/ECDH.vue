<script setup lang="ts">
defineOptions({ name: 'ECDH' });
const curve = ref(secp256r1);
const ec = computed(() => FpECC(curve.value));
// Alice
const k_a = ref({
  d: 0n,
  Q: {
    isInfinity: true,
    x: 0n,
    y: 0n,
  },
});
const ecdh_s_a = ref(0n);
const eccdh_s_a = ref(0n);
// Bob
const k_b = ref({
  d: 0n,
  Q: {
    isInfinity: true,
    x: 0n,
    y: 0n,
  },
});
const ecdh_s_b = ref(0n);
const eccdh_s_b = ref(0n);

const isSAComputeAble = computed(() => {
  const t = [k_a.value.d, k_b.value.Q.x, k_b.value.Q.y];
  return t.every(v => !!v);
});
const isSBComputeAble = computed(() => {
  const t = [k_b.value.d, k_a.value.Q.x, k_a.value.Q.y];
  return t.every(v => !!v);
});

const ecdh = catchNotifySync((a: typeof k_a.value, b: typeof k_a.value) => {
  return ec.value.ecdh(a, b).x;
});
const eccdh = catchNotifySync((a: typeof k_a.value, b: typeof k_a.value) => {
  return ec.value.eccdh(a, b).x;
});

watch(
  curve,
  catchNotifySync(() => {
    ecdh_s_a.value = 0n;
    ecdh_s_b.value = 0n;
    eccdh_s_a.value = 0n;
    eccdh_s_b.value = 0n;
  }),
);

onMounted(() => nextTick(() => {
  ecdh_s_a.value = ecdh(k_a.value, k_b.value);
  ecdh_s_b.value = ecdh(k_b.value, k_a.value);
  eccdh_s_a.value = eccdh(k_a.value, k_b.value);
  eccdh_s_b.value = eccdh(k_b.value, k_a.value);
}));
</script>

<template>
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    ECDH / ECCDH
  </h1>
  <KitFormSelectCurve v-model="curve" />
  <KitDivider>
    Key Exchange
  </KitDivider>
  <!-- Alice -->
  <KitCollapse class="bg-base-200" open>
    <template #header>
      Alice
    </template>
    <KitFormECKey
      v-model="k_a"
      :curve="curve"
      :fold="true"
      name="A"
    />
    <KitDivider>
      <KitButton
        :disabled="!isSAComputeAble"
        @click="eccdh_s_a = eccdh(k_a, k_b)"
      >
        ECCDH
      </KitButton>/
      <KitButton
        :disabled="!isSAComputeAble"
        @click="ecdh_s_a = ecdh(k_a, k_b)"
      >
        ECDH
      </KitButton>
    </KitDivider>
    <KitFormBigint
      v-model="ecdh_s_a"
      :title="`S = (dA * QB).x: (${getBIBits(ecdh_s_a)} bit)`"
    />
    <KitFormBigint
      v-model="eccdh_s_a"
      :title="`S = (dA * QB * h).x: (${getBIBits(eccdh_s_a)} bit)`"
    />
  </KitCollapse>
  <!-- Bob -->
  <KitCollapse class="mt-4 bg-base-200" open>
    <template #header>
      Bob
    </template>
    <KitFormECKey
      v-model="k_b"
      :curve="curve"
      :fold="true"
      name="B"
    />
    <KitDivider>
      <KitButton
        :disabled="!isSBComputeAble"
        @click="eccdh_s_b = eccdh(k_b, k_a)"
      >
        ECCDH
      </KitButton>/
      <KitButton
        :disabled="!isSBComputeAble"
        @click="ecdh_s_b = ecdh(k_b, k_a)"
      >
        ECDH
      </KitButton>
    </KitDivider>
    <KitFormBigint
      v-model="ecdh_s_b"
      :title="`S = (dB * QA).x: (${getBIBits(ecdh_s_b)} bit)`"
    />
    <KitFormBigint
      v-model="eccdh_s_b"
      :title="`S = (dB * QA * h).x: (${getBIBits(eccdh_s_b)} bit)`"
    />
  </KitCollapse>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
