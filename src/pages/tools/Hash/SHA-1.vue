<script setup lang="ts">
import { B64, B64URL, HEX, sha1, UTF8 } from 'mima-kit';

defineOptions({ name: 'SHA1' });

const params = reactive({
  codec: UTF8,
  input: '',
});
const hex = ref('');
const b64 = ref('');
const b64url = ref('');

watchEffect(() => {
  const { codec, input } = params;
  const res = sha1.digest(codec.parse(input));
  hex.value = HEX.stringify(res);
  b64.value = B64.stringify(res);
  b64url.value = B64URL.stringify(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto my-8 text-4xl font-bold">
      SHA-1
    </h1>
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
            :texts="['NIST', 'FIPS.180-4']"
            icon="icon-[carbon--pdf-reference]"
            href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf"
          />
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          First published
        </div>
        <div class="stat-value">
          1993
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Digest Size
        </div>
        <div class="stat-value">
          {{ sha1.DIGEST_SIZE }}-byte
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Block Size
        </div>
        <div class="stat-value">
          {{ sha1.BLOCK_SIZE }}-byte
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Structure
        </div>
        <div class="stat-value">
          Merkle-Damgård
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Round
        </div>
        <div class="stat-value">
          80
        </div>
      </div>
    </div>
  </div>
</template>
