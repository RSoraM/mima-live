<template>
  <div>
    <h1 class="text-5xl font-bold mx-auto my-8">MD5</h1>
    <KitFormCodecSelect title="Input Codec" v-model="params.codec" />
    <KitFormTextArea title="Input" v-model="params.input" />
    <div class="divider">OUTPUT</div>
    <KitFormOutput title="Hex" v-model="hex" />
    <KitFormOutput title="Base64" v-model="b64" />
    <KitFormOutput title="Base64URL" v-model="b64url" />

    <div class="stats stats-vertical shadow my-6">
      <div class="stat">
        <div class="stat-title">Designer</div>
        <div class="stat-value">Ronald Linn Rivest</div>
      </div>

      <div class="stat">
        <div class="stat-title">First published</div>
        <div class="stat-value">1992</div>
      </div>

      <div class="stat">
        <div class="stat-title">Digest Size</div>
        <div class="stat-value">{{ md5.DIGEST_SIZE }}-byte</div>
      </div>

      <div class="stat">
        <div class="stat-title">Block Size</div>
        <div class="stat-value">{{ md5.BLOCK_SIZE }}-byte</div>
      </div>

      <div class="stat">
        <div class="stat-title">Structure</div>
        <div class="stat-value">Merkle-Damgård</div>
      </div>

      <div class="stat">
        <div class="stat-title">Round</div>
        <div class="stat-value">4</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { B64, B64URL, HEX, md5, UTF8 } from 'mima-kit';

defineOptions({
  name: 'MD5',
})
const params = reactive({
  codec: UTF8,
  input: '',
})
const hex = ref('')
const b64 = ref('')
const b64url = ref('')

watchEffect(() => {
  const { codec, input } = params
  const res = md5.digest(codec.parse(input))
  hex.value = HEX.stringify(res)
  b64.value = B64.stringify(res)
  b64url.value = B64URL.stringify(res)
})
</script>
