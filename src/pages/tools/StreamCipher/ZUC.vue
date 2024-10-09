<script setup lang="ts">
import type { ZUCConfig } from 'mima-kit';
import { B64, B64URL, CSV, eea3, eia3, HEX, UTF8 } from 'mima-kit';

defineOptions({ name: 'ZUC' });

const params = reactive({
  COUNTER: '66035492',
  BEARER: 0xF,
  DIRECTION: 0 as 0 | 1,
  LENGTH: 0xC1,
  KEY: '173D14BA5003731D7A60049470F00A29',
  M: '6CF65340735552AB0C9752FA6F9025FE0BD675D9005875B2',
});
const config = reactive<ZUCConfig>({
  COUNTER_CODEC: HEX,
  KEY_CODEC: HEX,
  INPUT_CODEC: HEX,
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

const cipher = catchNotify(() => {
  const res_cipher = eea3(params, config);
  utf8_cipher.value = UTF8.stringify(res_cipher);
  hex_cipher.value = HEX.stringify(res_cipher);
  b64_cipher.value = B64.stringify(res_cipher);
  b64url_cipher.value = B64URL.stringify(res_cipher);
  csv_cipher.value = CSV.stringify(res_cipher);

  const res_mac = eia3(params, config);
  utf8_mac.value = UTF8.stringify(res_mac);
  hex_mac.value = HEX.stringify(res_mac);
  b64_mac.value = B64.stringify(res_mac);
  b64url_mac.value = B64URL.stringify(res_mac);
  csv_mac.value = CSV.stringify(res_mac);
});
</script>

<template>
  <div>
    <h1 class="mx-auto my-8 text-5xl font-bold">
      ZUC
    </h1>
    <div class="flex gap-2">
      <KitFormInput v-model="params.BEARER" type="number" title="Bearer" />
      <KitFormInput v-model="params.DIRECTION" type="number" title="Direction" />
    </div>
    <KitFormInputWithCodec v-model:text="params.COUNTER" v-model:codec="config.COUNTER_CODEC" title="Counter" />
    <KitFormInputWithCodec v-model:text="params.KEY" v-model:codec="config.KEY_CODEC" title="Key" />
    <div class="flex gap-2">
      <KitFormCodecSelect v-model="config.INPUT_CODEC" title="Input Codec" />
      <KitFormInput v-model="params.LENGTH" type="number" title="Input Length" />
    </div>
    <KitFormTextArea v-model="params.M" title="Input" />
    <div class="my-4 flex items-center justify-center gap-2">
      <button
        class="btn btn-primary"
        @click="cipher"
      >
        Cipher
      </button>
    </div>
    <div class="divider">
      UTF-8
    </div>
    <KitFormOutput v-model="utf8_cipher" title="Cipher" />
    <KitFormOutput v-model="utf8_mac" title="MAC" />
    <div class="divider">
      HEX
    </div>
    <KitFormOutput v-model="hex_cipher" title="Cipher" />
    <KitFormOutput v-model="hex_mac" title="MAC" />
    <div class="divider">
      Base64
    </div>
    <KitFormOutput v-model="b64_cipher" title="Cipher" />
    <KitFormOutput v-model="b64_mac" title="MAC" />
    <div class="divider">
      Base64 URL
    </div>
    <KitFormOutput v-model="b64url_cipher" title="Cipher" />
    <KitFormOutput v-model="b64url_mac" title="MAC" />
    <div class="divider">
      Core Socialist Values
    </div>
    <KitFormOutput v-model="csv_cipher" title="Cipher" />
    <KitFormOutput v-model="csv_mac" title="MAC" />

    <div class="stats stats-vertical my-6 shadow">
      <div class="stat">
        <div class="stat-title">
          Specification
        </div>
        <div class="stat-value">
          <KitRefLink
            :texts="['GB/T', '33133.1-2016']"
            icon="icon-[carbon--html-reference]"
            href="https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=8C41A3AEECCA52B5C0011C8010CF0715"
          />
          <KitRefLink
            :texts="['33133.2-2016']"
            icon="icon-[carbon--html-reference]"
            href="https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=5D3CBA3ADEC7989344BD1E63006EF2B3"
          />
          <KitRefLink
            :texts="['33133.3-2016']"
            icon="icon-[carbon--html-reference]"
            href="https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=C6D60AE0A7578E970EF2280ABD49F4F0"
          />
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
          Key Size
        </div>
        <div class="stat-value">
          16 bytes
        </div>
      </div>
    </div>
  </div>
</template>
