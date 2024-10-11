<script setup lang="ts">
import type { HMACScheme } from 'mima-kit';
import { B64, B64URL, HEX, hmac, md5, sha1, sha3_224, sha3_256, sha3_384, sha3_512, sha224, sha256, sha384, sha512, sha512t, sm3, UTF8 } from 'mima-kit';

defineOptions({ name: 'HMAC' });

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
];

const params = reactive({
  hash: 'SM3',
  t: '256',
  K: '',
  KCodec: UTF8,
  codec: UTF8,
  input: '',
});
const hex = ref('');
const b64 = ref('');
const b64url = ref('');

const alg = computed(catchNotifySync(() => {
  let c: HMACScheme | undefined;
  switch (params.hash) {
    case 'MD5':
      c = {
        hash: md5,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      };
      break;
    case 'SHA-1':
      c = {
        hash: sha1,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      };
      break;
    case 'SHA-224':
      c = {
        hash: sha224,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      };
      break;
    case 'SHA-256':
      c = {
        hash: sha256,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      };
      break;
    case 'SHA-384':
      c = {
        hash: sha384,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      };
      break;
    case 'SHA-512':
      c = {
        hash: sha512,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      };
      break;
    case 'SHA-512/t':
      c = {
        hash: sha512t(Number(params.t)),
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      };
      break;
    case 'SHA3-224':
      c = {
        hash: sha3_224,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      };
      break;
    case 'SHA3-256':
      c = {
        hash: sha3_256,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      };
      break;
    case 'SHA3-384':
      c = {
        hash: sha3_384,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      };
      break;
    case 'SHA3-512':
      c = {
        hash: sha3_512,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      };
      break;
    case 'SM3':
      c = {
        hash: sm3,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      };
      break;
  }
  return c ? hmac(c) : undefined;
}));

watchEffect(() => {
  if (!alg.value)
    return;
  const res = alg.value.digest(params.codec.parse(params.input));
  hex.value = HEX.stringify(res);
  b64.value = B64.stringify(res);
  b64url.value = B64URL.stringify(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto my-8 text-4xl font-bold">
      HMAC
    </h1>
    <div class="flex gap-2">
      <KitFormSelect v-model="params.hash" title="Hash" :options="hashOptions" />
      <KitFormInput v-show="params.hash === 'SHA-512/t'" v-model="params.t" title="output bits" />
    </div>
    <KitFormInputWithCodec v-model:text="params.K" v-model:codec="params.KCodec" title="key" />
    <KitFormCodecSelect v-model="params.codec" title="Input Codec" />
    <KitFormTextArea v-model="params.input" title="Input" />
    <div class="divider">
      OUTPUT
    </div>
    <KitFormOutput v-model="hex" title="Hex" />
    <KitFormOutput v-model="b64" title="Base64" />
    <KitFormOutput v-model="b64url" title="Base64URL" />

    <div class="stats stats-vertical my-6 shadow">
      <div class="stat">
        <div class="stat-title">
          Specification
        </div>
        <div class="stat-value">
          <KitRefLink
            :texts="['RFC 2104']"
            icon="icon-[carbon--txt-reference]"
            href="https://www.rfc-editor.org/rfc/rfc2104.txt"
          />
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          First published
        </div>
        <div class="stat-value">
          1996
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Digest Size
        </div>
        <div class="stat-value">
          {{ alg?.DIGEST_SIZE }}-byte
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Block Size
        </div>
        <div class="stat-value">
          {{ alg?.BLOCK_SIZE }}-byte
        </div>
      </div>
    </div>
  </div>
</template>
