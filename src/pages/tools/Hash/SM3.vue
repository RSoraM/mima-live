<template>
  <div>
    <h1 class="text-5xl font-bold mx-auto my-8">SM3</h1>
    <KitFormCodecSelect title="Input Codec" v-model="params.codec" />
    <KitFormTextArea title="Input" v-model="params.input" />
    <div class="divider">OUTPUT</div>
    <KitFormOutput title="Hex" v-model="hex" />
    <KitFormOutput title="Base64" v-model="b64" />
    <KitFormOutput title="Base64URL" v-model="b64url" />
    <KitFormOutput title="Core Socialist Values" v-model="csv" />

    <div class="stats stats-vertical shadow my-6">
      <div class="stat">
        <div class="stat-title">Designer</div>
        <div class="stat-value">NCA</div>
      </div>

      <div class="stat">
        <div class="stat-title">First published</div>
        <div class="stat-value">2010</div>
      </div>

      <div class="stat">
        <div class="stat-title">Digest Size</div>
        <div class="stat-value">{{ sm3.DIGEST_SIZE }}-byte</div>
      </div>

      <div class="stat">
        <div class="stat-title">Block Size</div>
        <div class="stat-value">{{ sm3.BLOCK_SIZE }}-byte</div>
      </div>

      <div class="stat">
        <div class="stat-title">Structure</div>
        <div class="stat-value">Merkle-Damgård</div>
      </div>

      <div class="stat">
        <div class="stat-title">Round</div>
        <div class="stat-value">64</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { B64, B64URL, HEX, CSV, sm3, UTF8 } from 'mima-kit';

defineOptions({
  name: 'SM3',
})
const params = reactive({
  codec: UTF8,
  input: '',
})
const hex = ref('')
const b64 = ref('')
const b64url = ref('')
const csv = ref('')

watchEffect(() => {
  const { codec, input } = params
  const res = sm3.digest(codec.parse(input))
  hex.value = HEX.stringify(res)
  b64.value = B64.stringify(res)
  b64url.value = B64URL.stringify(res)
  csv.value = CSV.stringify(res)
})
</script>
