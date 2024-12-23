<script setup lang="ts">
defineOptions({ name: 'KitFormCodecSelect' });

const {
  options: codec_options = [
    { label: 'UTF-8', value: UTF8.FORMAT },
    { label: 'HEX', value: HEX.FORMAT },
    { label: 'B64', value: B64.FORMAT },
    { label: 'B64URL', value: B64URL.FORMAT },
    { label: 'CSV', value: CSV.FORMAT },
  ],
} = defineProps<{
  title?: string;
  options?: SelectOption[];
}>();
const codec = defineModel<typeof UTF8>({ required: true });
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
  <KitFormSelect
    v-model="format"
    :options="codec_options"
    :title="title"
  />
</template>
