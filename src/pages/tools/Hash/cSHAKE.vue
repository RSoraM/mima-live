<template>
  <div>
    <h1 class="text-5xl font-bold mx-auto my-8">cSHAKE</h1>
    <div class="flex gap-2">
      <KitFormSelect title="Variant" :options="variantOptions" v-model="params.variants" />
      <KitFormInput title="output bits" v-model="params.t" />
    </div>
    <KitFormInputWithCodec title="function-name" v-model:text="params.N" v-model:codec="params.NCodec" />
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
import type { cSHAKEConfig } from 'mima-kit';
import { B64, B64URL, HEX, UTF8, cShake128, cShake256 } from 'mima-kit';

defineOptions({
  name: 'SHAKE',
})
const variantOptions = [
  { text: 'cSHAKE-128', value: 'cSHAKE-128' },
  { text: 'cSHAKE-256', value: 'cSHAKE-256' },
]
const params = reactive({
  variants: 'cSHAKE-128',
  N: '',
  NCodec: UTF8,
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
  const config: cSHAKEConfig = {
    N: params.N,
    N_CODEC: params.NCodec,
    S: params.S,
    S_CODEC: params.SCodec,
    INPUT_CODEC: params.codec,
  }
  switch (params.variants) {
    case 'cSHAKE-128':
      return cShake128(Number(params.t), config)
    case 'cSHAKE-256':
      return cShake256(Number(params.t), config)
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
