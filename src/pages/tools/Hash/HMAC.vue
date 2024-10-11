<script setup lang="ts">
import type { HMACScheme } from 'mima-kit';
import { HEX, hmac, md5, sha1, sha3_224, sha3_256, sha3_384, sha3_512, sha224, sha256, sha384, sha512, sha512t, shake128, shake256, sm3, UTF8 } from 'mima-kit';

defineOptions({ name: 'HMAC' });

const t = ref(256);
const hash = ref('SM3');
const hashOptions: SelectOption[] = [
  { label: 'SM3', value: 'SM3' },
  { label: 'MD5', value: 'MD5' },
  { label: 'SHA-1', value: 'SHA-1' },
  { label: 'SHA-224', value: 'SHA-224' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
  { label: 'SHA-512/t', value: 'SHA-512/t' },
  { label: 'SHA3-224', value: 'SHA3-224' },
  { label: 'SHA3-256', value: 'SHA3-256' },
  { label: 'SHA3-384', value: 'SHA3-384' },
  { label: 'SHA3-512', value: 'SHA3-512' },
  { label: 'SHAKE-128', value: 'SHAKE-128' },
  { label: 'SHAKE-256', value: 'SHAKE-256' },
];
const t_able = ['SHA-512/t', 'SHAKE-128', 'SHAKE-256'];

const k = ref('');
const k_codec = ref(UTF8);

const alg = computed(catchNotifySync(() => {
  let c: HMACScheme | undefined;
  switch (hash.value) {
    case 'MD5':
      c = {
        hash: md5,
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SHA-1':
      c = {
        hash: sha1,
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SHA-224':
      c = {
        hash: sha224,
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SHA-256':
      c = {
        hash: sha256,
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SHA-384':
      c = {
        hash: sha384,
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SHA-512':
      c = {
        hash: sha512,
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SHA-512/t':
      c = {
        hash: sha512t(t.value),
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SHA3-224':
      c = {
        hash: sha3_224,
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SHA3-256':
      c = {
        hash: sha3_256,
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SHA3-384':
      c = {
        hash: sha3_384,
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SHA3-512':
      c = {
        hash: sha3_512,
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SHAKE-128':
      c = {
        hash: shake128(t.value),
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SHAKE-256':
      c = {
        hash: shake256(t.value),
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
    case 'SM3':
      c = {
        hash: sm3,
        key: k.value,
        KEY_CODEC: k_codec.value,
      };
      break;
  }
  return c ? hmac(c) : undefined;
}));

const i = ref('mima-kit');
const i_codec = ref(UTF8);
const o = ref('');
const o_codec = ref(HEX);

watchEffect(() => {
  if (!alg.value)
    return;
  const I = i_codec.value.parse(i.value);
  const res = alg.value.digest(I);
  o.value = o_codec.value.stringify(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      HMAC
    </h1>
    <div class="flex gap-2">
      <KitFormControl title="Hash">
        <KitBaseFormSelect v-model="hash" :options="hashOptions" />
      </KitFormControl>
      <KitFormInput
        v-show="t_able.includes(hash)"
        v-model="t" type="number"
        title="output (bits)"
      />
    </div>
    <KitFormInputWithCodec v-model:text="k" v-model:codec="k_codec" title="Key" />
    <KitFormTextAreaWithCodec v-model:text="i" v-model:codec="i_codec" title="Input" />
    <KitFormTextAreaWithCodec v-model:text="o" v-model:codec="o_codec" title="Output" />

    <div class="stats stats-vertical my-6 shadow">
      <KitStat title="Specification">
        <KitRefLink
          :texts="['RFC 2104']"
          icon="icon-[carbon--txt-reference]"
          href="https://www.rfc-editor.org/rfc/rfc2104.txt"
        />
      </KitStat>

      <KitStat title="First published">
        1996
      </KitStat>

      <KitStat title="Digest Size (bytes)">
        {{ alg?.DIGEST_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ alg?.BLOCK_SIZE }}
      </KitStat>
    </div>
  </div>
</template>
