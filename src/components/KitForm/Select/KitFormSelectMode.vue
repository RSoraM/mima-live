<script setup lang="ts">
import { cbc, cfb, ctr, ecb, gcm, ofb, pcbc } from 'mima-kit';

defineOptions({ name: 'KitFormSelectMode' });
const { blocksize } = defineProps<{
  title?: string;
  blocksize?: number;
}>();
const mode = defineModel();

const options = computed(() => {
  const default_options: SelectOption[] = [
    { label: 'ECB', value: ecb },
    { label: 'CBC', value: cbc },
    { label: 'PCBC', value: pcbc },
    { label: 'CFB', value: cfb },
    { label: 'OFB', value: ofb },
    { label: 'CTR', value: ctr },
  ];
  // GCM only supports 16 bytes block size
  if (blocksize === 16) {
    default_options.push({ label: 'GCM', value: gcm });
  }
  return default_options;
});

/**
 * 强制会退到 ECB 模式
 */
watchEffect(() => {
  if (mode.value === gcm && blocksize !== 16) {
    mode.value = ecb;
  }
});
</script>

<template>
  <KitFormControl :title="title || 'Mode'">
    <KitBaseFormSelect v-model="mode" :options="options" />
  </KitFormControl>
</template>
