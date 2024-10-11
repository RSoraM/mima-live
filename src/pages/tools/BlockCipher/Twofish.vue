<script setup lang="ts">
import { B64, B64URL, cbc, HEX, twofish, UTF8 } from 'mima-kit';

defineOptions({ name: 'Twofish' });

const variantOptions: SelectOption[] = [
  { label: '128', value: 128 },
  { label: '192', value: 192 },
  { label: '256', value: 256 },
];
const b = ref<128 | 192 | 256>(128);
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

const alg = computed(catchNotifySync(() => twofish(b.value)));
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
      Twofish
    </h1>
    <div class="flex gap-2">
      <KitFormSelect v-model="b" :options="variantOptions" title="Key Size" />
      <KitFormModeSelect v-model="params.mode" />
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
          <KitRefLink
            :texts="['Twofish']"
            icon="icon-[carbon--html-reference]"
            href="https://www.schneier.com/academic/twofish/"
          />
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          First published
        </div>
        <div class="stat-value">
          1998
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Key Size (Bytes)
        </div>
        <div class="stat-value">
          {{ alg.KEY_SIZE }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Block Size (Bytes)
        </div>
        <div class="stat-value">
          {{ alg.BLOCK_SIZE }}
        </div>
      </div>
    </div>
  </div>
</template>
