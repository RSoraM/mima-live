<script setup lang="ts">
import { B64, B64URL, HEX, md5, UTF8 } from 'mima-kit';

defineOptions({ name: 'MD5' });

const params = reactive({
  codec: UTF8,
  input: '',
});
const hex = ref('');
const b64 = ref('');
const b64url = ref('');

watchEffect(() => {
  const { codec, input } = params;
  const res = md5.digest(codec.parse(input));
  hex.value = HEX.stringify(res);
  b64.value = B64.stringify(res);
  b64url.value = B64URL.stringify(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto my-8 text-4xl font-bold">
      MD5
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
            :texts="['RFC 1321']"
            icon="icon-[carbon--txt-reference]"
            href="https://www.rfc-editor.org/rfc/rfc1321.txt"
          />
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          First published
        </div>
        <div class="stat-value">
          1992
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Digest Size
        </div>
        <div class="stat-value">
          {{ md5.DIGEST_SIZE }}-byte
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Block Size
        </div>
        <div class="stat-value">
          {{ md5.BLOCK_SIZE }}-byte
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
          4
        </div>
      </div>
    </div>
  </div>
</template>
