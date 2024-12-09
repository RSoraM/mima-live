<script setup lang="ts">
import type { Codec, ecb, sm4, U8 } from 'mima-kit';
import { cbc, cfb, ctr, gcm, HEX, ofb, PKCS7_PAD } from 'mima-kit';

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
type Mode = typeof ecb | typeof cbc | typeof gcm;
const mode = ref<Mode>(cbc);
const padding = ref<typeof PKCS7_PAD>(PKCS7_PAD);
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

function createCipher(mode: Mode) {
  if (!cipher)
    throw new Error('Cipher Config Error');
  return mode(cipher, padding.value, t_size.value);
}

const encrypt = catchNotify(() => {
  const cipher = createCipher(mode.value);
  const K = k_codec.value(k.value);
  const IV = iv_codec.value(iv.value);
  const P = p_codec.value(p.value);
  const C = cipher(K, IV).encrypt(P);
  c.value = c_codec.value(C);
});
const decrypt = catchNotify(() => {
  const cipher = createCipher(mode.value);
  const K = k_codec.value(k.value);
  const IV = iv_codec.value(iv.value);
  const C = c_codec.value(c.value);
  const P = cipher(K, IV).decrypt(C);
  p.value = p_codec.value(P);
});
const sign = catchNotify(() => {
  if (mode.value !== gcm)
    throw new Error('Only GCM mode supports signing');
  const cipher = createCipher(gcm) as ReturnType<typeof gcm>;
  const K = k_codec.value(k.value);
  const IV = iv_codec.value(iv.value);
  // sign need to encrypt first
  const P = p_codec.value(p.value);
  const C = cipher(K, IV).encrypt(P);
  c.value = c_codec.value(C);
  // then sign
  const A = a_codec.value(a.value);
  const T: U8 = cipher(K, IV).sign(C, A);
  t.value = t_codec.value(T);
});
const verify = catchNotify(() => {
  if (mode.value !== gcm)
    throw new Error('Only GCM mode supports verifying');
  const cipher = createCipher(gcm) as ReturnType<typeof gcm>;
  const K = k_codec.value(k.value);
  const IV = iv_codec.value(iv.value);
  const C = c_codec.value(c.value);
  const A = a_codec.value(a.value);
  const T = t_codec.value(t.value);
  if (!cipher(K, IV).verify(T, C, A)) {
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

const allowNoPadModes = [cfb, ofb, ctr, gcm];
const disableNoPad = computed(() => !allowNoPadModes.includes(mode.value));
</script>

<template>
  <div class="flex gap-2">
    <KitFormModeSelect v-model="mode" :blocksize="cipher.BLOCK_SIZE" />
    <KitFormPaddingSelect v-model:padding="padding" v-model:disable-no-pad="disableNoPad" />
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
