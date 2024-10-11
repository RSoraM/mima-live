<script setup lang="ts">
import { arc5, B64, B64URL, cbc, HEX, UTF8 } from 'mima-kit';

defineOptions({ name: 'ARC5' });

const variantOptions: SelectOption[] = [
  { label: '8', value: 8 },
  { label: '16', value: 16 },
  { label: '32', value: 32 },
  { label: '64', value: 64 },
  { label: '128', value: 128 },
];
const b = ref<8 | 16 | 32 | 64 | 128>(64);
const r = ref(20);
const params = reactive({
  K: '8586c1e4007b4ac8ea156616bb813986',
  K_CODE: HEX,
  IV: '060d358b88e62a5287b1df4dddf016b3',
  IV_CODE: HEX,
  mode: cbc,
  codec: UTF8,
  input: 'mima-kit',
});
const utf8 = ref('');
const hex = ref('');
const b64 = ref('');
const b64url = ref('');

const alg = computed(catchNotifySync(() => arc5(b.value, r.value)));
function createCipher() {
  const { K, K_CODE, IV, IV_CODE } = params;
  return params.mode(alg.value)(K_CODE.parse(K), IV_CODE.parse(IV));
}

const encrypt = catchNotify(() => {
  const { codec, input } = params;
  const cipher = createCipher();
  const res = cipher._encrypt(codec.parse(input));
  utf8.value = UTF8.stringify(res);
  hex.value = HEX.stringify(res);
  b64.value = B64.stringify(res);
  b64url.value = B64URL.stringify(res);
});
const decrypt = catchNotify(() => {
  const { codec, input } = params;
  const cipher = createCipher();
  const res = cipher._decrypt(codec.parse(input));
  utf8.value = UTF8.stringify(res);
  hex.value = HEX.stringify(res);
  b64.value = B64.stringify(res);
  b64url.value = B64URL.stringify(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto my-8 text-5xl font-bold">
      ARC5
    </h1>
    <div class="flex gap-2">
      <KitFormSelect v-model="b" :options="variantOptions" title="Word Size" />
      <KitFormInput v-model="r" type="number" title="Rounds" />
    </div>
    <KitFormModeSelect v-model="params.mode" />
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
    <div class="divider">
      OUTPUT
    </div>
    <KitFormOutput v-model="utf8" title="UTF-8" />
    <KitFormOutput v-model="hex" title="Hex" />
    <KitFormOutput v-model="b64" title="Base64" />
    <KitFormOutput v-model="b64url" title="Base64URL" />

    <div class="mx-auto my-6 text-xl font-bold">
      Suggestions Spec
    </div>
    <table class="table table-zebra table-lg">
      <thead>
        <tr>
          <th>Word Size (Bytes)</th>
          <th>rounds</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>8</td>
          <td>8</td>
        </tr>
        <tr>
          <td>16</td>
          <td>12</td>
        </tr>
        <tr>
          <td>32</td>
          <td>16</td>
        </tr>
        <tr>
          <td>64</td>
          <td>20</td>
        </tr>
        <tr>
          <td>128</td>
          <td>32</td>
        </tr>
      </tbody>
    </table>

    <div class="stats stats-vertical my-6 shadow">
      <div class="stat">
        <div class="stat-title">
          Specification
        </div>
        <div class="stat-value">
          <KitRefLink
            :texts="['RC5']"
            icon="icon-[carbon--pdf-reference]"
            href="https://people.csail.mit.edu/rivest/pubs/Riv94.revised-1997-03-20.pdf"
          />
          <KitRefLink
            :texts="['RFC 2040']"
            icon="icon-[carbon--txt-reference]"
            href="https://www.rfc-editor.org/rfc/rfc2040.txt"
          />
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
          Key Size (Bytes)
        </div>
        <div class="stat-value">
          1-255
        </div>
      </div>
    </div>
  </div>
</template>
