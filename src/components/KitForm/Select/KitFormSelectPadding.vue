<script setup lang="ts">
defineOptions({ name: 'KitFormSelectPadding' });

const {
  titlePrefix = '',
  title = '',
  titleSuffix = '',
  mode,
} = defineProps<{
  titlePrefix?: string;
  title?: string;
  titleSuffix?: string;
  mode: typeof ecb | typeof cbc | typeof gcm;
}>();
const disable_no_pad = computed(() => ![cfb, ofb, ctr, gcm].includes(mode));
const options = computed<SelectOption[]>(() => ([
  { label: 'PKCS#7', value: PKCS7_PAD.ALGORITHM },
  { label: 'ANSI X9.23', value: X923_PAD.ALGORITHM },
  { label: 'ISO 7816-4', value: ISO7816_PAD.ALGORITHM },
  { label: 'Zero Padding', value: ZERO_PAD.ALGORITHM },
  { label: 'None Padding', value: NO_PAD.ALGORITHM, disable: disable_no_pad.value },
]));

const padding = defineModel<typeof PKCS7_PAD>({ required: true });
const alg = ref(padding.value.ALGORITHM);

watchEffect(() => {
  if (alg.value === PKCS7_PAD.ALGORITHM) {
    padding.value = PKCS7_PAD;
  }
  else if (alg.value === X923_PAD.ALGORITHM) {
    padding.value = X923_PAD;
  }
  else if (alg.value === ISO7816_PAD.ALGORITHM) {
    padding.value = ISO7816_PAD;
  }
  else if (alg.value === ZERO_PAD.ALGORITHM) {
    padding.value = ZERO_PAD;
  }
  else if (alg.value === NO_PAD.ALGORITHM) {
    padding.value = NO_PAD;
  }
});
</script>

<template>
  <KitFormSelect
    v-model="alg"
    :options="options"
    :title-prefix="titlePrefix"
    :title="title"
    :title-suffix="titleSuffix"
  />
</template>
