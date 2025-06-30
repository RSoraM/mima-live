<script setup lang="ts">
defineOptions({ name: 'KitFormSelectCodec' });

const {
  options: codec_options = [
    { label: 'UTF-8', value: UTF8.FORMAT },
    { label: 'HEX', value: HEX.FORMAT },
    { label: 'B64', value: B64.FORMAT },
    { label: 'B64URL', value: B64URL.FORMAT },
    { label: 'B32', value: B32.FORMAT },
    { label: 'B32HEX', value: 'B32HEX' },
    { label: 'B32Crockford', value: 'B32Crockford' },
    { label: 'CSV', value: CSV.FORMAT },
  ],
  titlePrefix = '',
  title = '',
  titleSuffix = '',
} = defineProps<{
  options?: SelectOption[];
  titlePrefix?: string;
  title?: string;
  titleSuffix?: string;
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
      case B32.FORMAT:
        codec.value = B32;
        return;
      case 'B32HEX':
        codec.value = B32({ variant: 'rfc4648-hex' });
        return;
      case 'B32Crockford':
        codec.value = B32({ variant: 'crockford' });
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
  <KitFormSelect v-model="format" :options="codec_options" :title-prefix="titlePrefix" :title="title"
    :title-suffix="titleSuffix" />
</template>
