<script setup lang="ts">
import { arc4, B64, B64URL, HEX, UTF8 } from 'mima-kit';

defineOptions({ name: 'ARC4' });

const params = reactive({
  K: 'password',
  K_CODE: UTF8,
  codec: UTF8,
  input: '',
});
const utf8 = ref('');
const hex = ref('');
const b64 = ref('');
const b64url = ref('');

function createCipher() {
  const { K, K_CODE } = params;
  return arc4(K_CODE.parse(K));
}

function encrypt() {
  const { codec, input } = params;
  const cipher = createCipher();
  const res = cipher._encrypt(codec.parse(input));
  utf8.value = UTF8.stringify(res);
  hex.value = HEX.stringify(res);
  b64.value = B64.stringify(res);
  b64url.value = B64URL.stringify(res);
}
function decrypt() {
  const { codec, input } = params;
  const cipher = createCipher();
  const res = cipher._decrypt(codec.parse(input));
  utf8.value = UTF8.stringify(res);
  hex.value = HEX.stringify(res);
  b64.value = B64.stringify(res);
  b64url.value = B64URL.stringify(res);
}
</script>

<template>
  <div>
    <h1 class="mx-auto my-8 text-5xl font-bold">
      ARC4
    </h1>
    <KitFormInputWithCodec v-model:text="params.K" v-model:codec="params.K_CODE" title="Key" />
    <KitFormCodecSelect v-model="params.codec" title="Input Codec" />
    <KitFormTextArea v-model="params.input" title="Input" />
    <div class="my-4 flex items-center justify-center gap-2">
      <button
        class="btn btn-primary"
        @click="encrypt"
      >
        Encrypt
      </button>
      <button
        class="btn btn-primary"
        @click="decrypt"
      >
        Decrypt
      </button>
    </div>
    <div class="divider">
      OUTPUT
    </div>
    <KitFormOutput v-model="utf8" title="UTF-8" />
    <KitFormOutput v-model="hex" title="Hex" />
    <KitFormOutput v-model="b64" title="Base64" />
    <KitFormOutput v-model="b64url" title="Base64URL" />

    <div class="stats stats-vertical my-6 shadow">
      <div class="stat">
        <div class="stat-title">
          Designer
        </div>
        <div class="stat-value">
          Ronald Linn Rivest
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          First published
        </div>
        <div class="stat-value">
          1994
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Key Size
        </div>
        <div class="stat-value">
          5-256 bytes
        </div>
      </div>
    </div>
  </div>
</template>
