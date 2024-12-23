<script setup lang="ts">
import type { Codec } from 'mima-kit';
import { B64, B64URL, CSV, HEX, UTF8 } from 'mima-kit';

defineOptions({ name: 'KitFormCodecSelect' });
defineProps<{ title?: string }>();
const codec = defineModel<Codec>({ default: UTF8 });
const options: SelectOption[] = [
  { label: 'UTF-8', value: UTF8.FORMAT },
  { label: 'HEX', value: HEX.FORMAT },
  { label: 'B64', value: B64.FORMAT },
  { label: 'B64URL', value: B64URL.FORMAT },
  { label: 'CSV', value: CSV.FORMAT },
];
const format = computed({
  get: () => codec.value.FORMAT,
  set: (value: string) => {
    switch (value) {
      case UTF8.FORMAT:
        codec.value = UTF8;
        return;
      case HEX.FORMAT:
        codec.value = HEX;
        return;
      case B64.FORMAT:
        codec.value = B64;
        return;
      case B64URL.FORMAT:
        codec.value = B64URL;
        return;
      case CSV.FORMAT:
        codec.value = CSV;
        return;
      default:
        codec.value = UTF8;
    }
  },
});
</script>

<template>
  <KitBaseFormSelect v-model="format" :options="options" :title="title || 'Codec'" />
</template>
