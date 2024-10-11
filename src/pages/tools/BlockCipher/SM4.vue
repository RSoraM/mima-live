<script setup lang="ts">
import type { CBCConfig } from 'mima-kit';
import { B64, B64URL, cbc, CSV, HEX, PKCS7, sm4, UTF8 } from 'mima-kit';

defineOptions({ name: 'SM4' });

const params = reactive({
  K: '0123456789abcdeffedcba9876543210',
  K_CODE: HEX,
  IV: '0123456789abcdeffedcba9876543210',
  IV_CODE: HEX,
  mode: cbc,
  padding: PKCS7,
  codec: HEX,
  input: '0123456789abcdeffedcba9876543210',
});
const utf8_cipher = ref('');
const hex_cipher = ref('');
const b64_cipher = ref('');
const b64url_cipher = ref('');
const csv_cipher = ref('');
const utf8_mac = ref('');
const hex_mac = ref('');
const b64_mac = ref('');
const b64url_mac = ref('');
const csv_mac = ref('');

function createCipher() {
  const { K, K_CODE, IV, IV_CODE, padding } = params;
  const config: CBCConfig = {
    PADDING: padding,
    KEY_CODEC: K_CODE,
    IV_CODEC: IV_CODE,
  };
  return params.mode(sm4, config)(K, IV);
}

const encrypt = catchNotify(() => {
  const { codec, input } = params;
  const cipher = createCipher();
  const res = cipher._encrypt(codec.parse(input));
  utf8_cipher.value = UTF8.stringify(res);
  hex_cipher.value = HEX.stringify(res);
  b64_cipher.value = B64.stringify(res);
  b64url_cipher.value = B64URL.stringify(res);
  csv_cipher.value = CSV.stringify(res);
});
const decrypt = catchNotify(() => {
  const { codec, input } = params;
  const cipher = createCipher();
  const res = cipher._decrypt(codec.parse(input));
  utf8_cipher.value = UTF8.stringify(res);
  hex_cipher.value = HEX.stringify(res);
  b64_cipher.value = B64.stringify(res);
  b64url_cipher.value = B64URL.stringify(res);
  csv_cipher.value = CSV.stringify(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto my-8 text-5xl font-bold">
      SM4
    </h1>
    <div class="flex gap-2">
      <KitFormModeSelect v-model="params.mode" />
      <KitFormPaddingSelect v-model="params.padding" />
    </div>
    <KitFormInputWithCodec v-model:text="params.K" v-model:codec="params.K_CODE" title="Key" />
    <KitFormInputWithCodec
      v-show="params.mode.ALGORITHM !== 'ECB'"
      v-model:text="params.IV" v-model:codec="params.IV_CODE" title="IV"
    />
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
    <KitFormCipherOutput v-model:cipher="utf8_cipher" v-model:mac="utf8_mac" title="UTF8" />
    <KitFormCipherOutput v-model:cipher="hex_cipher" v-model:mac="hex_mac" title="HEX" />
    <KitFormCipherOutput v-model:cipher="b64_cipher" v-model:mac="b64_mac" title="Base64" />
    <KitFormCipherOutput v-model:cipher="b64url_cipher" v-model:mac="b64url_mac" title="Base64URL" />
    <KitFormCipherOutput v-model:cipher="csv_cipher" v-model:mac="csv_mac" title="Core Socialist Values" />

    <div class="stats stats-vertical my-6 shadow">
      <div class="stat">
        <div class="stat-title">
          Specification
        </div>
        <div class="stat-value">
          <KitRefLink
            :texts="['GM/T', '0002-2012']"
            icon="icon-[carbon--pdf-reference]"
            href="http://www.gmbz.org.cn/upload/2018-04-04/1522788048733065051.pdf"
          />
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          First published
        </div>
        <div class="stat-value">
          2006
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Key Size
        </div>
        <div class="stat-value">
          {{ sm4.KEY_SIZE }} bytes
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Block Size
        </div>
        <div class="stat-value">
          {{ sm4.BLOCK_SIZE }} bytes
        </div>
      </div>
    </div>
  </div>
</template>
