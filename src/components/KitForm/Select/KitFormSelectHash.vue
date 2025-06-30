<script setup lang="ts">
defineOptions({ name: 'KitFormSelectHash' });

const {
  options: hash_options = [
    { label: 'SM3', value: sm3.ALGORITHM },
    { label: 'MD5', value: md5.ALGORITHM },
    { label: 'SHA-1', value: sha1.ALGORITHM },
    { label: 'SHA-224', value: sha224.ALGORITHM },
    { label: 'SHA-256', value: sha256.ALGORITHM },
    { label: 'SHA-384', value: sha384.ALGORITHM },
    { label: 'SHA-512', value: sha512.ALGORITHM },
    { label: 'SHA-512/t', value: 'SHA-512/t' },
    { label: 'SHA3-224', value: sha3_224.ALGORITHM },
    { label: 'SHA3-256', value: sha3_256.ALGORITHM },
    { label: 'SHA3-384', value: sha3_384.ALGORITHM },
    { label: 'SHA3-512', value: sha3_512.ALGORITHM },
    { label: 'SHAKE-128', value: 'SHAKE-128' },
    { label: 'SHAKE-256', value: 'SHAKE-256' },
    { label: 'cSHAKE-128', value: 'cSHAKE-128' },
    { label: 'cSHAKE-256', value: 'cSHAKE-256' },
    { label: 'ParallelHash-128', value: 'ParallelHash-128' },
    { label: 'ParallelHash-256', value: 'ParallelHash-256' },
    { label: 'ParallelHash-128XOF', value: 'ParallelHash-128XOF' },
    { label: 'ParallelHash-256XOF', value: 'ParallelHash-256XOF' },
    { label: 'TurboSHAKE-128', value: 'TurboSHAKE-128' },
    { label: 'TurboSHAKE-256', value: 'TurboSHAKE-256' },
    { label: 'KangarooTwelve-128', value: 'KangarooTwelve-128' },
    { label: 'KangarooTwelve-256', value: 'KangarooTwelve-256' },
  ],
  titlePrefix = '',
  title = '',
  titleSuffix = '',
  open = false,
} = defineProps<{
  options?: SelectOption[];
  titlePrefix?: string;
  title?: string;
  titleSuffix?: string;
  open?: boolean;
}>();
const hash = defineModel<typeof sha256>({ required: true });
const alg = ref(hash.value.ALGORITHM);

// DIGEST SIZE
const t = ref(256);
const show_t = computed(() => [
  'SHA-512/t',
  'SHAKE-128',
  'SHAKE-256',
  'cSHAKE-128',
  'cSHAKE-256',
  'ParallelHash-128',
  'ParallelHash-256',
  'ParallelHash-128XOF',
  'ParallelHash-256XOF',
  'TurboSHAKE-128',
  'TurboSHAKE-256',
  'KangarooTwelve-128',
  'KangarooTwelve-256',
].includes(alg.value));

// Function name
const fn = ref(new U8());
const show_fn = computed(() => [
  'cSHAKE-128',
  'cSHAKE-256',
].includes(alg.value));

// Customization
const ct = ref(new U8());
const show_ct = computed(() => [
  'cSHAKE-128',
  'cSHAKE-256',
  'ParallelHash-128',
  'ParallelHash-256',
  'ParallelHash-128XOF',
  'ParallelHash-256XOF',
  'KangarooTwelve-128',
  'KangarooTwelve-256',
].includes(alg.value));

// Block size
const block_size = ref(1024);
const show_block_size = computed(() => [
  'ParallelHash-128',
  'ParallelHash-256',
  'ParallelHash-128XOF',
  'ParallelHash-256XOF',
].includes(alg.value));

// Domain Separator
const ds = ref(0x1F);
const show_ds = computed(() => [
  'TurboSHAKE-128',
  'TurboSHAKE-256',
].includes(alg.value));

const show_config = computed(() => show_t.value || show_fn.value || show_ct.value || show_block_size.value || show_ds.value);

watchImmediate(alg, () => {
  if (alg.value === 'SHA-512/t') {
    t.value = 256;
  }
  else if (['SHAKE-128', 'cSHAKE-128', 'ParallelHash-128', 'ParallelHash-128XOF', 'TurboSHAKE-128', 'KangarooTwelve-128'].includes(alg.value)) {
    t.value = 256;
  }
  else if (['SHAKE-256', 'cSHAKE-256', 'ParallelHash-256', 'ParallelHash-256XOF', 'TurboSHAKE-256', 'KangarooTwelve-256'].includes(alg.value)) {
    t.value = 512;
  }
});

watchEffect(catchNotifySync(() => {
  const S = ct.value;
  const N = fn.value;
  if (alg.value === sm3.ALGORITHM) {
    hash.value = sm3;
  }
  else if (alg.value === md5.ALGORITHM) {
    hash.value = md5;
  }
  else if (alg.value === sha1.ALGORITHM) {
    hash.value = sha1;
  }
  else if (alg.value === sha224.ALGORITHM) {
    hash.value = sha224;
  }
  else if (alg.value === sha256.ALGORITHM) {
    hash.value = sha256;
  }
  else if (alg.value === sha384.ALGORITHM) {
    hash.value = sha384;
  }
  else if (alg.value === sha512.ALGORITHM) {
    hash.value = sha512;
  }
  else if (alg.value === 'SHA-512/t') {
    hash.value = sha512t(t.value);
  }
  else if (alg.value === sha3_224.ALGORITHM) {
    hash.value = sha3_224;
  }
  else if (alg.value === sha3_256.ALGORITHM) {
    hash.value = sha3_256;
  }
  else if (alg.value === sha3_384.ALGORITHM) {
    hash.value = sha3_384;
  }
  else if (alg.value === sha3_512.ALGORITHM) {
    hash.value = sha3_512;
  }
  else if (alg.value === 'SHAKE-128') {
    hash.value = shake128(t.value);
  }
  else if (alg.value === 'SHAKE-256') {
    hash.value = shake256(t.value);
  }
  else if (alg.value === 'cSHAKE-128') {
    hash.value = cshake128(t.value, N, S);
  }
  else if (alg.value === 'cSHAKE-256') {
    hash.value = cshake256(t.value, N, S);
  }
  else if (alg.value === 'ParallelHash-128') {
    hash.value = parallelhash128(block_size.value, t.value, S);
  }
  else if (alg.value === 'ParallelHash-256') {
    hash.value = parallelhash256(block_size.value, t.value, S);
  }
  else if (alg.value === 'ParallelHash-128XOF') {
    hash.value = parallelhash128XOF(block_size.value, t.value, S);
  }
  else if (alg.value === 'ParallelHash-256XOF') {
    hash.value = parallelhash256XOF(block_size.value, t.value, S);
  }
  else if (alg.value === 'TurboSHAKE-128') {
    hash.value = turboshake128(t.value, ds.value);
  }
  else if (alg.value === 'TurboSHAKE-256') {
    hash.value = turboshake256(t.value, ds.value);
  }
  else if (alg.value === 'KangarooTwelve-128') {
    hash.value = kt128(t.value, S);
  }
  else if (alg.value === 'KangarooTwelve-256') {
    hash.value = kt256(t.value, S);
  }
}));
</script>

<template>
  <KitFormSelect
    v-model="alg" :options="hash_options"
    :title="title" :="$attrs"
    :title-prefix="titlePrefix"
    :title-suffix="titleSuffix"
  />
  <KitFoldCard
    v-show="show_config" title="Hash Config"
    class="mt-2" :open="open"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-2">
      <KitFormNumber
        v-if="show_t"
        v-model="t" :class="{ 'md:col-span-2': !show_block_size && !show_ds }"
        title="Digest Size (bit)"
      />
      <KitFormNumber
        v-if="show_block_size" v-model="block_size"
        title="Block Size (bit)"
      />
      <KitFormNumber
        v-if="show_ds" v-model="ds"
        title="Domain Separator"
      />
    </div>
    <KitFormU8
      v-if="show_fn"
      v-model="fn" :codec="UTF8"
      :immediate="true"
      title="Function-Name"
    />
    <KitFormU8
      v-if="show_ct"
      v-model="ct" :codec="UTF8"
      :immediate="true"
      title="Customization"
    />
  </KitFoldCard>
</template>
