<script setup lang="ts">
import { ANSI_X923, ISO7816_4, NoPadding, PKCS7, ZERO_PAD } from 'mima-kit';

defineOptions({ name: 'KitFormPaddingSelect' });
defineProps<{ title?: string }>();
const padding = defineModel();

const options: SelectOption[] = [
  { label: 'PKCS7', value: PKCS7 },
  { label: 'ZERO_PAD', value: ZERO_PAD },
  { label: 'NoPadding', value: NoPadding },
  { label: 'ISO7816_4', value: ISO7816_4 },
  { label: 'ANSI_X923', value: ANSI_X923 },
];
</script>

<template>
  <KitFormSelect v-model="padding" :options="options" :title="title || 'Padding'" />
</template>
