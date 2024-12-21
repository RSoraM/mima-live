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
const k_x = ref<ReturnType<typeof ec['value']['genKey']>>({
  d: 0n,
  Q: {
    isInfinity: true,
    x: 0n,
    y: 0n,
  },
});
const s_a = ref(0n);
const s_a_str = ref('');
// Bob
const k_b = ref<ReturnType<typeof ec['value']['genKey']>>({
  d: 0n,
  Q: {
    isInfinity: true,
    x: 0n,
    y: 0n,
  },
});
const k_y = ref<ReturnType<typeof ec['value']['genKey']>>({
  d: 0n,
  Q: {
    isInfinity: true,
    x: 0n,
    y: 0n,
  },
});
const s_b = ref(0n);
const s_b_str = ref('');

const isSAComputeAble = computed(() => {
  const t = [
    k_a.value.d,
    k_a.value.Q.x,
    k_a.value.Q.y,
    k_x.value.d,
    k_x.value.Q.x,
    k_x.value.Q.y,
    k_b.value.Q.x,
    k_b.value.Q.y,
    k_y.value.Q.x,
    k_y.value.Q.y,
  ];
  return t.every(v => !!v);
});
const isSBComputeAble = computed(() => {
  const t = [
    k_b.value.d,
    k_b.value.Q.x,
    k_b.value.Q.y,
    k_y.value.d,
    k_y.value.Q.x,
    k_y.value.Q.y,
    k_a.value.Q.x,
    k_a.value.Q.y,
    k_x.value.Q.x,
    k_x.value.Q.y,
  ];
  return t.every(v => !!v);
});

function ecmqv(
  k_a: ReturnType<typeof ec['value']['genKey']>,
  k_x: ReturnType<typeof ec['value']['genKey']>,
  k_b: ReturnType<typeof ec['value']['genKey']>,
  k_y: ReturnType<typeof ec['value']['genKey']>,
) {
  return ec.value.ecmqv(k_a, k_x, k_b, k_y).x;
}

watch(
  curve,
  catchNotifySync(() => {
    s_a.value = 0n;
    s_b.value = 0n;
  }),
);
watch(
  [s_a, s_b],
  catchNotifySync(() => {
    s_a_str.value = U8.fromBI(s_a.value).to(codec.value);
    s_b_str.value = U8.fromBI(s_b.value).to(codec.value);
  }),
  { immediate: true },
);
watch(
  [s_a_str, s_b_str],
  catchNotifySync(() => {
    s_a.value = codec.value(s_a_str.value).toBI();
    s_b.value = codec.value(s_b_str.value).toBI();
  }),
  { immediate: true },
);
onMounted(() => {
  s_a.value = ecmqv(k_a.value, k_x.value, k_b.value, k_y.value);
  s_b.value = ecmqv(k_b.value, k_y.value, k_a.value, k_x.value);
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      ECMQV
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
      <KitFormECKey
        v-model="k_x"
        :curve="curve"
        :fold="true"
        title="X"
      />
      <div class="divider my-8">
        <KitButton
          :disabled="!isSAComputeAble"
          @click="s_a = ecmqv(k_a, k_x, k_b, k_y)"
        >
          ECMQV
        </KitButton>
      </div>
      <KitFormInputWithCodec
        v-model:codec="codec"
        v-model:text="s_a_str"
        :title="`S (${getBIBits(s_a)} bit)`"
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
      <KitFormECKey
        v-model="k_y"
        :curve="curve"
        :fold="true"
        title="Y"
      />
      <div class="divider my-8">
        <KitButton
          :disabled="!isSBComputeAble"
          @click="s_b = ecmqv(k_b, k_y, k_a, k_x)"
        >
          ECMQV
        </KitButton>
      </div>
      <KitFormInputWithCodec
        v-model:codec="codec"
        v-model:text="s_b_str"
        :title="`S (${getBIBits(s_b)} bit)`"
      />
    </KitCollapse>

    <!-- Curve Parameters -->
    <div class="divider my-8">
      Curve Parameters
    </div>
    <KitCurveTable :curve="curve" :codec="codec" />
  </div>
</template>
