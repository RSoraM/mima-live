<template>
  <div>
    <h1 class="text-5xl font-bold mx-auto my-8">TupleHash</h1>
    <div class="flex gap-2">
      <KitFormSelect title="Variant" :options="variantOptions" v-model="params.variants" />
      <KitFormInput title="output bits" v-model="params.t" />
    </div>
    <KitFormInputWithCodec title="customization" v-model:text="params.S" v-model:codec="params.SCodec" />
    <KitFormCodecSelect title="Input Codec" v-model="params.codec" />
    <!-- <KitFormTextArea title="Input" v-model="params.input" /> -->
    <KitFormInputArray title="Input Array" v-model="params.input" />
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
import type { TupleHashConfig } from 'mima-kit';
import { B64, B64URL, HEX, UTF8 } from 'mima-kit';
import { tupleHash128, tupleHash128XOF } from 'mima-kit';
import { tupleHash256, tupleHash256XOF } from 'mima-kit';

defineOptions({
  name: 'TupleHash',
})
const variantOptions = [
  { text: 'TupleHash-128', value: 'TupleHash-128' },
  { text: 'TupleHash-128 XOF', value: 'TupleHash-128 XOF' },
  { text: 'TupleHash-256', value: 'TupleHash-256' },
  { text: 'TupleHash-256 XOF', value: 'TupleHash-256 XOF' },
]
const params = reactive({
  variants: 'TupleHash-128',
  S: '',
  SCodec: UTF8,
  t: '256',
  codec: UTF8,
  input: [{ value: '' }],
})
const hex = ref('')
const b64 = ref('')
const b64url = ref('')

const alg = computed(() => {
  const config: TupleHashConfig = {
    S: params.S,
    S_CODEC: params.SCodec,
    INPUT_CODEC: params.codec,
  }
  const t = Number(params.t)
  switch (params.variants) {
    case 'TupleHash-128':
      return tupleHash128(t, config)
    case 'TupleHash-128 XOF':
      return tupleHash128XOF(t, config)
    case 'TupleHash-256':
      return tupleHash256(t, config)
    case 'TupleHash-256 XOF':
      return tupleHash256XOF(t, config)
  }
})

watchEffect(() => {
  if (!alg.value) return
  const { codec, input } = params
  const res = alg.value.digest(input.map(i => codec.parse(i.value)))
  hex.value = HEX.stringify(res)
  b64.value = B64.stringify(res)
  b64url.value = B64URL.stringify(res)
})
</script>
