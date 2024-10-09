<script setup lang="ts">
import { B64, B64URL, HEX, rabbit, UTF8 } from 'mima-kit';

defineOptions({ name: 'Rabbit' });

const params = reactive({
  K: '00000000000000000000000000000000',
  K_CODE: HEX,
  IV: '',
  IV_CODE: HEX,
  codec: UTF8,
  input: '',
});
const utf8 = ref('');
const hex = ref('');
const b64 = ref('');
const b64url = ref('');

function createCipher() {
  const { K, K_CODE, IV, IV_CODE } = params;
  return rabbit(K_CODE.parse(K), IV_CODE.parse(IV));
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
      Rabbit
    </h1>
    <KitFormInputWithCodec v-model:text="params.K" v-model:codec="params.K_CODE" title="Key" />
    <KitFormInputWithCodec v-model:text="params.IV" v-model:codec="params.IV_CODE" title="IV" />
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
          Specification
        </div>
        <div class="stat-value">
          RFC 4503
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          First published
        </div>
        <div class="stat-value">
          2003
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Structure
        </div>
        <div class="stat-value">
          ARX
        </div>
      </div>
    </div>
  </div>
</template>
