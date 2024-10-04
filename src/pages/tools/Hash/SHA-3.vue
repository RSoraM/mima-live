<template>
  <div>
    <h1 class="text-5xl font-bold mx-auto my-8">SHA-3</h1>
    <KitFormSelect title="Variant" :options="variantOptions" v-model="params.variants" />
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
import { B64, B64URL, HEX, UTF8, sha3_224, sha3_256, sha3_384, sha3_512 } from 'mima-kit';

defineOptions({
  name: 'SHA-3',
})
const variantOptions = [
  { text: 'SHA-3-224', value: 'SHA-3-224' },
  { text: 'SHA-3-256', value: 'SHA-3-256' },
  { text: 'SHA-3-384', value: 'SHA-3-384' },
  { text: 'SHA-3-512', value: 'SHA-3-512' },
]
const params = reactive({
  variants: 'SHA-3-256',
  codec: UTF8,
  input: '',
})
const hex = ref('')
const b64 = ref('')
const b64url = ref('')

const alg = computed(() => {
  switch (params.variants) {
    case 'SHA-3-224':
      return sha3_224
    case 'SHA-3-256':
      return sha3_256
    case 'SHA-3-384':
      return sha3_384
    case 'SHA-3-512':
      return sha3_512
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
