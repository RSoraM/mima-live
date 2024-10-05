<template>
  <div>
    <h1 class="text-5xl font-bold mx-auto my-8">HMAC</h1>
    <div class="flex gap-2">
      <KitFormSelect title="Hash" :options="hashOptions" v-model="params.hash" />
      <KitFormInput v-show="params.hash === 'SHA-512/t'" title="output bits" v-model="params.t" />
    </div>
    <KitFormInputWithCodec title="key" v-model:text="params.K" v-model:codec="params.KCodec" />
    <KitFormCodecSelect title="Input Codec" v-model="params.codec" />
    <KitFormTextArea title="Input" v-model="params.input" />
    <div class="divider">OUTPUT</div>
    <KitFormOutput title="Hex" v-model="hex" />
    <KitFormOutput title="Base64" v-model="b64" />
    <KitFormOutput title="Base64URL" v-model="b64url" />

    <div class="stats stats-vertical shadow my-6">
      <div class="stat">
        <div class="stat-title">Specification</div>
        <div class="stat-value">RFC 2104</div>
      </div>

      <div class="stat">
        <div class="stat-title">First published</div>
        <div class="stat-value">1996</div>
      </div>

      <div class="stat">
        <div class="stat-title">Digest Size</div>
        <div class="stat-value">{{ alg?.DIGEST_SIZE }}-byte</div>
      </div>

      <div class="stat">
        <div class="stat-title">Block Size</div>
        <div class="stat-value">{{ alg?.BLOCK_SIZE }}-byte</div>
      </div>

      <div class="stat">
        <div class="stat-title">Structure</div>
        <div class="stat-value">Merkle-Damgård</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HMACScheme } from 'mima-kit';
import { B64, B64URL, HEX, UTF8 } from 'mima-kit';
import { sm3, md5, sha1, hmac } from 'mima-kit';
import { sha224, sha256, sha384, sha512, sha512t } from 'mima-kit';
import { sha3_224, sha3_256, sha3_384, sha3_512 } from 'mima-kit';

defineOptions({
  name: 'HMAC',
})
const hashOptions = [
  { text: 'MD5', value: 'MD5' },
  { text: 'SHA-1', value: 'SHA-1' },
  { text: 'SHA-224', value: 'SHA-224' },
  { text: 'SHA-256', value: 'SHA-256' },
  { text: 'SHA-384', value: 'SHA-384' },
  { text: 'SHA-512', value: 'SHA-512' },
  { text: 'SHA-512/t', value: 'SHA-512/t' },
  { text: 'SHA3-224', value: 'SHA3-224' },
  { text: 'SHA3-256', value: 'SHA3-256' },
  { text: 'SHA3-384', value: 'SHA3-384' },
  { text: 'SHA3-512', value: 'SHA3-512' },
  { text: 'SM3', value: 'SM3' },
]
const params = reactive({
  hash: 'SM3',
  /** for sha512/t */
  t: '256',
  K: '',
  KCodec: UTF8,
  codec: UTF8,
  input: '',
})
const hex = ref('')
const b64 = ref('')
const b64url = ref('')

const alg = computed(() => {
  let c: HMACScheme
  switch (params.hash) {
    case 'MD5':
      c = {
        hash: md5,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      }
      return hmac(c)
    case 'SHA-1':
      c = {
        hash: sha1,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      }
      return hmac(c)
    case 'SHA-224':
      c = {
        hash: sha224,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      }
      return hmac(c)
    case 'SHA-256':
      c = {
        hash: sha256,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      }
      return hmac(c)
    case 'SHA-384':
      c = {
        hash: sha384,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      }
      return hmac(c)
    case 'SHA-512':
      c = {
        hash: sha512,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      }
      return hmac(c)
    case 'SHA-512/t':
      c = {
        hash: sha512t(Number(params.t)),
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      }
      return hmac(c)
    case 'SHA3-224':
      c = {
        hash: sha3_224,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      }
      return hmac(c)
    case 'SHA3-256':
      c = {
        hash: sha3_256,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      }
      return hmac(c)
    case 'SHA3-384':
      c = {
        hash: sha3_384,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      }
      return hmac(c)
    case 'SHA3-512':
      c = {
        hash: sha3_512,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      }
      return hmac(c)
    case 'SM3':
      c = {
        hash: sm3,
        key: params.K,
        KEY_CODEC: params.KCodec,
        INPUT_CODEC: params.codec,
      }
      return hmac(c)
    default:
      throw new Error('Invalid hash')
  }
})

watchEffect(() => {
  if (!alg.value) return
  const res = alg.value.digest(params.codec.parse(params.input))
  hex.value = HEX.stringify(res)
  b64.value = B64.stringify(res)
  b64url.value = B64URL.stringify(res)
})
</script>
