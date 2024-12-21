<script setup lang="ts">
import { FpECC, HEX, secp256r1, U8 } from 'mima-kit';

const curve = ref(secp256r1);
const ec = computed(() => FpECC(curve.value));
const codec = ref(HEX);
// Alice
const k_a = ref<ReturnType<typeof ec['value']['genKey']>>({
  d: 0n,
  Q: {
    isInfinity: true,
    x: 0n,
    y: 0n,
  },
});
const ecdh_s_a = ref(0n);
const ecdh_s_a_str = ref('');
const eccdh_s_a = ref(0n);
const eccdh_s_a_str = ref('');
// Bob
const k_b = ref<ReturnType<typeof ec['value']['genKey']>>({
  d: 0n,
  Q: {
    isInfinity: true,
    x: 0n,
    y: 0n,
  },
});
const ecdh_s_b = ref(0n);
const ecdh_s_b_str = ref('');
const eccdh_s_b = ref(0n);
const eccdh_s_b_str = ref('');

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
watch(
  [ecdh_s_a, eccdh_s_a, ecdh_s_b, eccdh_s_b],
  catchNotifySync(() => {
    ecdh_s_a_str.value = U8.fromBI(ecdh_s_a.value).to(codec.value);
    eccdh_s_a_str.value = U8.fromBI(eccdh_s_a.value).to(codec.value);
    ecdh_s_b_str.value = U8.fromBI(ecdh_s_b.value).to(codec.value);
    eccdh_s_b_str.value = U8.fromBI(eccdh_s_b.value).to(codec.value);
  }),
  { immediate: true },
);
watch(
  [ecdh_s_a_str, eccdh_s_a_str, ecdh_s_b_str, eccdh_s_b_str],
  catchNotifySync(() => {
    ecdh_s_a.value = codec.value(ecdh_s_a_str.value).toBI();
    eccdh_s_a.value = codec.value(eccdh_s_a_str.value).toBI();
    ecdh_s_b.value = codec.value(ecdh_s_b_str.value).toBI();
    eccdh_s_b.value = codec.value(eccdh_s_b_str.value).toBI();
  }),
  { immediate: true },
);
onMounted(() => {
  ecdh_s_a.value = ecdh(k_a.value, k_b.value);
  ecdh_s_b.value = ecdh(k_b.value, k_a.value);
  eccdh_s_a.value = eccdh(k_a.value, k_b.value);
  eccdh_s_b.value = eccdh(k_b.value, k_a.value);
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      ECDH / ECCDH
    </h1>
    <KitFormCurveSelect v-model="curve" />
    <div class="divider my-8">
      Key Exchange
    </div>
    <!-- Alice -->
    <KitCollapse class="bg-base-200" open>
      <template #header>
        Alice
      </template>
      <KitFormECKey
        v-model="k_a"
        :curve="curve"
        :fold="true"
        title="A"
      />
      <div class="divider my-8">
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
      </div>
      <KitFormInputWithCodec
        v-model:codec="codec"
        v-model:text="ecdh_s_a_str"
        :title="`S = (dA * QB).x: (${getBIBits(ecdh_s_a)} bit)`"
      />
      <KitFormInputWithCodec
        v-model:codec="codec"
        v-model:text="eccdh_s_a_str"
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
        title="B"
      />
      <div class="divider my-8">
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
      </div>
      <KitFormInputWithCodec
        v-model:codec="codec"
        v-model:text="ecdh_s_b_str"
        :title="`S = (dB * QA).x: (${getBIBits(ecdh_s_b)} bit)`"
      />
      <KitFormInputWithCodec
        v-model:codec="codec"
        v-model:text="eccdh_s_b_str"
        :title="`S = (dB * QA * h).x: (${getBIBits(eccdh_s_b)} bit)`"
      />
    </KitCollapse>

    <!-- Curve Parameters -->
    <div class="divider my-8">
      Curve Parameters
    </div>
    <KitCurveTable :curve="curve" :codec="codec" />
  </div>
</template>
