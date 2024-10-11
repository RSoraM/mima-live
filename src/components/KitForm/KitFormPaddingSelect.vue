<script setup lang="ts">
import { ANSI_X923, ISO7816_4, NoPadding, PKCS7, ZERO_PAD } from 'mima-kit';

defineOptions({ name: 'KitFormPaddingSelect' });
defineProps<{ title?: string }>();
const padding = defineModel();

const options: SelectOption[] = [
  { label: 'PKCS#7', value: PKCS7 },
  { label: 'ANSI X9.23', value: ANSI_X923 },
  { label: 'ISO 7816-4', value: ISO7816_4 },
  { label: 'Zero Padding', value: ZERO_PAD },
  { label: 'None Padding', value: NoPadding },
];
</script>

<template>
  <KitFormControl :title="title || 'Padding'">
    <KitBaseFormSelect v-model="padding" :options="options" />
  </KitFormControl>
</template>
