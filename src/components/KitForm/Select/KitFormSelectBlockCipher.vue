<script setup lang="ts">
defineOptions({ name: 'KitFormSelectKDF' });

const {
  options: cipher_alg = [
    { label: 'SM4', value: 'SM4' },
    { label: 'AES', value: 'AES' },
    { label: 'ARIA', value: 'ARIA' },
    { label: 'Camellia', value: 'Camellia' },
    { label: 'DES', value: 'DES' },
    { label: '3DES', value: '3DES' },
    { label: 'ARC5', value: 'ARC5' },
    { label: 'Blowfish', value: 'Blowfish' },
    { label: 'Twofish', value: 'Twofish' },
    { label: 'TEA', value: 'TEA' },
    { label: 'XTEA', value: 'XTEA' },
  ],
} = defineProps<{
  options?: SelectOption[];
  title?: string;
}>();

const alg = ref('SM4');

// Key size
const key_size = ref<128 | 192 | 256>(128);
const key_size_option = computed<SelectOption[]>(() => ([
  { label: '128', value: 128 },
  { label: '192', value: 192 },
  { label: '256', value: 256, disable: alg.value === '3DES' },
]));
const show_key_size_option = computed(() => [
  'AES',
  'ARIA',
  'Camellia',
  '3DES',
  'Twofish',
].includes(alg.value));

// ARC5 options
const arc5_r = ref(20);
const arc5_ws = ref<8 | 16 | 32 | 64 | 128>(64);
const arc5_ws_option: SelectOption[] = [
  { label: '8', value: 8 },
  { label: '16', value: 16 },
  { label: '32', value: 32 },
  { label: '64', value: 64 },
  { label: '128', value: 128 },
];
const show_arc5_option = computed(() => alg.value === 'ARC5');

// TEA options
const tea_r = ref(32);
const show_tea_r = computed(() => ['TEA', 'XTEA'].includes(alg.value));

const block_cipher = defineModel<typeof sm4>({ required: true });

watchEffect(catchNotifySync(() => {
  if (alg.value === 'SM4') {
    block_cipher.value = sm4;
  }
  else if (alg.value === 'AES') {
    block_cipher.value = aes(key_size.value);
  }
  else if (alg.value === 'ARIA') {
    block_cipher.value = aria(key_size.value);
  }
  else if (alg.value === 'Camellia') {
    block_cipher.value = camellia(key_size.value);
  }
  else if (alg.value === 'DES') {
    block_cipher.value = des;
  }
  else if (alg.value === '3DES') {
    block_cipher.value = t_des(key_size.value as 128 | 192);
  }
  else if (alg.value === 'ARC5') {
    block_cipher.value = arc5(arc5_ws.value, arc5_r.value);
  }
  else if (alg.value === 'Blowfish') {
    block_cipher.value = blowfish;
  }
  else if (alg.value === 'Twofish') {
    block_cipher.value = twofish(key_size.value);
  }
  else if (alg.value === 'TEA') {
    block_cipher.value = tea(tea_r.value);
  }
  else if (alg.value === 'XTEA') {
    block_cipher.value = xtea(tea_r.value);
  }
}));
</script>

<template>
  <div>
    <KitFormSelect
      v-model="alg"
      :options="cipher_alg"
      :title="title"
    />
    <KitFormSelect
      v-show="show_key_size_option"
      v-model="key_size"
      :options="key_size_option"
      title="Key Size"
    />
    <div v-show="show_arc5_option" class="flex gap-2">
      <KitFormSelect
        v-model="arc5_ws"
        :options="arc5_ws_option"
        title="Word Size (byte)"
      />
      <KitFormNumber v-model="arc5_r" title="Rounds" />
    </div>
    <KitFormNumber v-show="show_tea_r" v-model="tea_r" title="Rounds" />
  </div>
</template>
