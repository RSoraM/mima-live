<template>
  <div>
    <h1 class="text-5xl font-bold mx-auto my-8">SHA-2</h1>
    <div class="flex gap-2">
      <KitFormSelect title="Variant" :options="variantOptions" v-model="params.variants" />
      <KitFormInput v-show="params.variants === 'SHA-512/t'" title="output bits" v-model="params.t" />
    </div>
    <KitFormCodecSelect title="Input Codec" v-model="params.codec" />
    <KitFormTextArea title="Input" v-model="params.input" />
    <div class="divider">OUTPUT</div>
    <KitFormOutput title="Hex" v-model="hex" />
    <KitFormOutput title="Base64" v-model="b64" />
    <KitFormOutput title="Base64URL" v-model="b64url" />

    <div class="stats stats-vertical shadow my-6">
      <div class="stat">
        <div class="stat-title">Designer</div>
        <div class="stat-value">NSA</div>
      </div>

      <div class="stat">
        <div class="stat-title">First published</div>
        <div class="stat-value">2001</div>
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
        <div class="stat-value">with</div>
        <div class="stat-value">Davies-Meyer</div>
      </div>

      <div class="stat">
        <div class="stat-title">Round</div>
        <div class="stat-value">64 or 80</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { B64, B64URL, HEX, UTF8, sha224, sha256, sha384, sha512, sha512t } from 'mima-kit';

defineOptions({
  name: 'SHA-2',
})
const variantOptions = [
  { text: 'SHA-224', value: 'SHA-224' },
  { text: 'SHA-256', value: 'SHA-256' },
  { text: 'SHA-384', value: 'SHA-384' },
  { text: 'SHA-512', value: 'SHA-512' },
  { text: 'SHA-512/t', value: 'SHA-512/t' },
]
const params = reactive({
  variants: 'SHA-256',
  t: '224',
  codec: UTF8,
  input: '',
})
const hex = ref('')
const b64 = ref('')
const b64url = ref('')

const alg = computed(() => {
  switch (params.variants) {
    case 'SHA-224':
      return sha224
    case 'SHA-256':
      return sha256
    case 'SHA-384':
      return sha384
    case 'SHA-512':
      return sha512
    case 'SHA-512/t':
      return sha512t(Number(params.t))
  }
})

watchEffect(() => {
  if (!alg.value) return
  const { codec, input } = params
  const res = alg.value.digest(codec.parse(input))
  hex.value = HEX.stringify(res)
  b64.value = B64.stringify(res)
  b64url.value = B64URL.stringify(res)
})
</script>
