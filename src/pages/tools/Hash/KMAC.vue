<template>
  <div>
    <h1 class="text-5xl font-bold mx-auto my-8">KMAC</h1>
    <div class="flex gap-2">
      <KitFormSelect title="Variant" :options="variantOptions" v-model="params.variants" />
      <KitFormInput title="output bits" v-model="params.t" />
    </div>
    <KitFormInputWithCodec title="key" v-model:text="params.K" v-model:codec="params.KCodec" />
    <KitFormInputWithCodec title="customization" v-model:text="params.S" v-model:codec="params.SCodec" />
    <KitFormCodecSelect title="Input Codec" v-model="params.codec" />
    <KitFormTextArea title="Input" v-model="params.input" />
    <div class="divider">OUTPUT</div>
    <KitFormOutput title="Hex" v-model="hex" />
    <KitFormOutput title="Base64" v-model="b64" />
    <KitFormOutput title="Base64URL" v-model="b64url" />

    <div class="stats stats-vertical shadow my-6">
      <div class="stat">
        <div class="stat-title">Designer</div>
        <div class="stat-value">Team Keccak</div>
      </div>

      <div class="stat">
        <div class="stat-title">First published</div>
        <div class="stat-value">2016</div>
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
        <div class="stat-value">Sponge</div>
        <div class="stat-value">with</div>
        <div class="stat-value">Keccak</div>
      </div>

      <div class="stat">
        <div class="stat-title">Round</div>
        <div class="stat-value">24</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KMACConfig } from 'mima-kit';
import { B64, B64URL, HEX, UTF8 } from 'mima-kit';
import { kmac128, kmac128XOF, kmac256, kmac256XOF } from 'mima-kit';

defineOptions({
  name: 'KMAC',
})
const variantOptions = [
  { text: 'KMAC-128', value: 'KMAC-128' },
  { text: 'KMAC-128 XOF', value: 'KMAC-128 XOF' },
  { text: 'KMAC-256', value: 'KMAC-256' },
  { text: 'KMAC-256 XOF', value: 'KMAC-256 XOF' },
]
const params = reactive({
  variants: 'KMAC-128',
  K: '',
  KCodec: UTF8,
  S: '',
  SCodec: UTF8,
  t: '256',
  codec: UTF8,
  input: '',
})
const hex = ref('')
const b64 = ref('')
const b64url = ref('')

const alg = computed(() => {
  const config: KMACConfig = {
    K: params.K,
    K_CODEC: params.KCodec,
    S: params.S,
    S_CODEC: params.SCodec,
    INPUT_CODEC: params.codec,
  }
  switch (params.variants) {
    case 'KMAC-128':
      return kmac128(Number(params.t), config)
    case 'KMAC-128 XOF':
      return kmac128XOF(Number(params.t), config)
    case 'KMAC-256':
      return kmac256(Number(params.t), config)
    case 'KMAC-256 XOF':
      return kmac256XOF(Number(params.t), config)
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
