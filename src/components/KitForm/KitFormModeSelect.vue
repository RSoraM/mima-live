<script setup lang="ts">
import { cbc, cfb, ctr, ecb, gcm, ofb, pcbc } from 'mima-kit';

defineOptions({ name: 'KitFormModeSelect' });
defineProps<{ title?: string }>();
const mode = defineModel();

const options: SelectOption[] = [
  { label: 'ECB', value: ecb },
  { label: 'CBC', value: cbc },
  { label: 'PCBC', value: pcbc },
  { label: 'CFB', value: cfb },
  { label: 'OFB', value: ofb },
  { label: 'CTR', value: ctr },
  { label: 'GCM', value: gcm },
];
</script>

<template>
  <KitFormSelect v-model="mode" :options="options" :title="title || 'Mode'" />
</template>
