<script setup lang="ts">
import type { Codec } from 'mima-kit';
import { B64, B64URL, CSV, HEX, UTF8 } from 'mima-kit';

defineOptions({ name: 'KitFormCodecSelect' });
defineProps<{ title?: string }>();
const codec = defineModel();

const options: SelectOption<Codec>[] = [
  { label: 'UTF-8', value: UTF8 },
  { label: 'HEX', value: HEX },
  { label: 'Base64', value: B64 },
  { label: 'Base64URL', value: B64URL },
  { label: 'Core Values', value: CSV },
];
</script>

<template>
  <KitFormSelect v-model="codec" :options="options" :title="title || 'Codec'" />
</template>
