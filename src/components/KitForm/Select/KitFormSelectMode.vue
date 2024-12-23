<script setup lang="ts">
defineOptions({ name: 'KitFormSelectMode' });

const { blocksize } = defineProps<{
  title?: string;
  blocksize?: number;
}>();
const options = computed(() => {
  const default_options: SelectOption[] = [
    { label: 'ECB', value: 'ECB' },
    { label: 'CBC', value: 'CBC' },
    { label: 'PCBC', value: 'PCBC' },
    { label: 'CFB', value: 'CFB' },
    { label: 'OFB', value: 'OFB' },
    { label: 'CTR', value: 'CTR' },
  ];
  // GCM only supports 16 bytes block size
  if (blocksize === 16) {
    default_options.push({ label: 'GCM', value: 'GCM' });
  }
  return default_options;
});

const alg = ref('CBC');
const mode = defineModel({ required: true });

watchEffect(() => {
  if (alg.value === 'ECB') {
    mode.value = ecb;
  }
  else if (alg.value === 'CBC') {
    mode.value = cbc;
  }
  else if (alg.value === 'PCBC') {
    mode.value = pcbc;
  }
  else if (alg.value === 'CFB') {
    mode.value = cfb;
  }
  else if (alg.value === 'OFB') {
    mode.value = ofb;
  }
  else if (alg.value === 'CTR') {
    mode.value = ctr;
  }
  else if (alg.value === 'GCM') {
    mode.value = gcm;
  }

  /** 强制会退到 ECB 模式 */
  if (alg.value === 'GCM' && blocksize !== 16) {
    alg.value = 'ECB';
    mode.value = ecb;
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
