<script setup lang="ts">
import type { cfb, Codec, ctr, ecb, ofb, pcbc, sm4 } from 'mima-kit';
import { cbc, gcm, HEX, PKCS7 } from 'mima-kit';

defineOptions({ name: 'KitFormModeConfig' });

const { cipher, init } = defineProps<{
  cipher: typeof sm4;
  init?: InitValues;
}>();
interface InitValues {
  k: string;
  iv: string;
  a: string;
  t: string;
  p: string;
  c: string;
}
type MODE = typeof ecb | typeof cbc | typeof pcbc | typeof cfb | typeof ofb | typeof ctr | typeof gcm;
const mode = ref<MODE>(cbc);
const padding = ref<typeof PKCS7>(PKCS7);
// key
const k = ref(init?.k || '');
const k_codec = ref<Codec>(HEX);
// iv
const iv = ref(init?.iv || '');
const iv_codec = ref<Codec>(HEX);
// additional data
const a = ref(init?.a || '');
const a_codec = ref<Codec>(HEX);
// auth tag
const t = ref(init?.t || '');
const t_codec = ref<Codec>(HEX);
const t_size = ref(16);
// plain text
const p = ref(init?.p || '');
const p_codec = ref<Codec>(HEX);
// cipher text
const c = ref(init?.c || '');
const c_codec = ref<Codec>(HEX);

function createSuite(mode: MODE) {
  if (!cipher)
    throw new Error('Cipher Config Error');
  const config = {
    PADDING: padding.value,
    KEY_CODEC: k_codec.value,
    IV_CODEC: iv_codec.value,
    ADDITIONAL_CODEC: a_codec.value,
    AUTH_TAG_SIZE: t_size.value,
  };

  return mode(cipher, config)(k.value, iv.value);
}

const encrypt = catchNotify(() => {
  const suite = createSuite(mode.value);
  const _p = p_codec.value.parse(p.value);
  const res = suite._encrypt(_p);
  c.value = c_codec.value.stringify(res);
});
const decrypt = catchNotify(() => {
  const suite = createSuite(mode.value);
  const _c = c_codec.value.parse(c.value);
  const res = suite._decrypt(_c);
  p.value = p_codec.value.stringify(res);
});
const sign = catchNotify(() => {
  if (mode.value !== gcm)
    throw new Error('Only GCM mode supports signing');
  const suite = createSuite(gcm);

  // sign need to encrypt first
  const _p = p_codec.value.parse(p.value);
  const cipher_result = suite._encrypt(_p);
  c.value = c_codec.value.stringify(cipher_result);

  // then sign
  const _c = c_codec.value.parse(c.value);
  const _a = a_codec.value.parse(a.value);
  const mac_result = (suite as any)._sign(_c, _a);
  t.value = t_codec.value.stringify(mac_result);
});
const verify = catchNotify(() => {
  if (mode.value !== gcm)
    throw new Error('Only GCM mode supports verifying');
  const suite = createSuite(gcm);
  const _c = c_codec.value.parse(c.value);
  const _a = a_codec.value.parse(a.value);
  const _t = t_codec.value.parse(t.value);
  const res = (suite as any)._verify(_t, _c, _a);
  if (!res) {
    throw new Error('Verification failed');
  }
  else {
    $notify({
      title: 'Verification',
      message: 'Verification success',
      type: 'success',
    });
  }
});
</script>

<template>
  <div class="flex gap-2">
    <KitFormModeSelect v-model="mode" :blocksize="cipher.BLOCK_SIZE" />
    <KitFormPaddingSelect v-model="padding" />
  </div>
  <KitFormInputWithCodec v-model:text="k" v-model:codec="k_codec" title="Key" />
  <KitFormInputWithCodec
    v-show="mode.ALGORITHM !== 'ECB'"
    v-model:text="iv" v-model:codec="iv_codec" title="IV"
  />

  <div class="divider my-8">
    <button
      class="btn btn-outline btn-sm"
      @click="encrypt"
    >
      Encrypt
    </button>
    /
    <button
      class="btn btn-outline btn-sm"
      @click="decrypt"
    >
      Decrypt
    </button>
  </div>
  <KitFormTextAreaWithCodec v-model:text="p" v-model:codec="p_codec" title="Plain text" />
  <KitFormTextAreaWithCodec v-model:text="c" v-model:codec="c_codec" title="Cipher text" />

  <div
    v-show="mode.ALGORITHM === 'GCM'"
    class="divider my-8"
  >
    <button
      class="btn btn-outline btn-sm"
      @click="sign"
    >
      Sign
    </button>
    /
    <button
      class="btn btn-outline btn-sm"
      @click="verify"
    >
      Verify
    </button>
  </div>
  <KitFormInputWithCodec
    v-show="mode.ALGORITHM === 'GCM'"
    v-model:text="a" v-model:codec="a_codec" title="Additional Data"
  />
  <KitFormInputWithCodec
    v-show="mode.ALGORITHM === 'GCM'"
    v-model:text="t" v-model:codec="t_codec" title="Auth Tag"
  />
</template>
