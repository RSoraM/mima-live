<script setup lang="ts">
defineOptions({ name: 'KitFormSelectPadding' });

const { mode } = defineProps<{
  title?: string;
  mode: typeof ecb | typeof cbc | typeof gcm;
}>();
const disable_no_pad = computed(() => ![cfb, ofb, ctr, gcm].includes(mode));
const options = computed<SelectOption[]>(() => ([
  { label: 'PKCS#7', value: 'PKCS#7' },
  { label: 'ANSI X9.23', value: 'ANSI X9.23' },
  { label: 'ISO 7816-4', value: 'ISO 7816-4' },
  { label: 'Zero Padding', value: 'Zero Padding' },
  { label: 'None Padding', value: 'None Padding', disable: disable_no_pad.value },
]));

const alg = ref('PKCS#7');
const padding = defineModel<typeof PKCS7_PAD>({ required: true });

watchEffect(() => {
  if (alg.value === 'PKCS#7') {
    padding.value = PKCS7_PAD;
  }
  else if (alg.value === 'ANSI X9.23') {
    padding.value = X923_PAD;
  }
  else if (alg.value === 'ISO 7816-4') {
    padding.value = ISO7816_PAD;
  }
  else if (alg.value === 'Zero Padding') {
    padding.value = ZERO_PAD;
  }
  else if (alg.value === 'None Padding') {
    padding.value = NO_PAD;
  }
});
</script>

<template>
  <KitFormSelect
    v-model="alg"
    :options="options"
    :title="title"
  />
</template>
