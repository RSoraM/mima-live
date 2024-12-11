<script setup lang="ts">
import { md5, sha1, sha3_224, sha3_256, sha3_384, sha3_512, sha224, sha256, sha384, sha512, sha512t, shake128, shake256, sm3 } from 'mima-kit';

defineOptions({ name: 'KitFormHashSelect' });
defineProps<{ title?: string }>();
const hash = defineModel<typeof sha256>({ default: sha256 });
const t = ref(256);
const alg = ref(hash.value.ALGORITHM);
const hash_options: SelectOption[] = [
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
];
watch(alg, () => {
  switch (alg.value) {
    case md5.ALGORITHM:
      hash.value = md5;
      break;
    case sha1.ALGORITHM:
      hash.value = sha1;
      break;
    case sha224.ALGORITHM:
      hash.value = sha224;
      break;
    case sha256.ALGORITHM:
      hash.value = sha256;
      break;
    case sha384.ALGORITHM:
      hash.value = sha384;
      break;
    case sha512.ALGORITHM:
      hash.value = sha512;
      break;
    case 'SHA-512/t':
      hash.value = sha512t(t.value);
      break;
    case sha3_224.ALGORITHM:
      hash.value = sha3_224;
      break;
    case sha3_256.ALGORITHM:
      hash.value = sha3_256;
      break;
    case sha3_384.ALGORITHM:
      hash.value = sha3_384;
      break;
    case sha3_512.ALGORITHM:
      hash.value = sha3_512;
      break;
    case 'SHAKE-128':
      hash.value = shake128(t.value);
      break;
    case 'SHAKE-256':
      hash.value = shake256(t.value);
      break;
    case sm3.ALGORITHM:
      hash.value = sm3;
      break;
    default:
      break;
  }
});
const show_t = computed(() => ['SHA-512/t', 'SHAKE-128', 'SHAKE-256'].includes(alg.value));
</script>

<template>
  <div class="flex gap-2">
    <KitFormControl :title="title || 'Hash'">
      <KitBaseFormSelect v-model="alg" :options="hash_options" />
    </KitFormControl>
    <KitFormInput v-show="show_t" v-model="t" title="t" />
  </div>
</template>
