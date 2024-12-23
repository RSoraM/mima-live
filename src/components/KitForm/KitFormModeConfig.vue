<script setup lang="ts">
import type { ecb, sm4 } from 'mima-kit';
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
const K = ref(HEX(init?.k || ''));
// iv
const IV = ref(HEX(init?.iv || ''));
// additional data
const A = ref(HEX(init?.a || ''));
// auth tag
const T = ref(HEX(init?.t || ''));
const t_size = ref(16);
// plain text
const P = ref(HEX(init?.p || ''));
// cipher text
const C = ref(HEX(init?.c || ''));

function createCipher(mode: Mode) {
  return mode(cipher, padding.value, t_size.value);
}

const encrypt = catchNotify(() => {
  const cipher = createCipher(mode.value);
  C.value = cipher(K.value, IV.value).encrypt(P.value);
});
const decrypt = catchNotify(() => {
  const cipher = createCipher(mode.value);
  P.value = cipher(K.value, IV.value).decrypt(C.value);
});
const sign = catchNotify(() => {
  if (mode.value !== gcm)
    throw new Error('Only GCM mode supports signing');
  const cipher = createCipher(gcm) as ReturnType<typeof gcm>;
  C.value = cipher(K.value, IV.value).encrypt(P.value);
  T.value = cipher(K.value, IV.value).sign(C.value, A.value);
});
const verify = catchNotify(() => {
  if (mode.value !== gcm)
    throw new Error('Only GCM mode supports verifying');
  const cipher = createCipher(gcm) as ReturnType<typeof gcm>;
  if (!cipher(K.value, IV.value).verify(T.value, C.value, A.value)) {
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
    <KitFormSelectMode v-model="mode" :blocksize="cipher.BLOCK_SIZE" />
    <KitFormSelectPadding v-model:padding="padding" v-model:disable-no-pad="disableNoPad" />
  </div>
  <KitFormU8
    v-model:buffer="K"
    :codec="HEX"
    title="Key"
  />
  <KitFormU8
    v-show="mode.ALGORITHM !== 'ECB'"
    v-model:buffer="IV"
    :codec="HEX"
    title="IV"
  />

  <div class="divider my-8">
    <KitButton @click="encrypt">
      Encrypt
    </KitButton>/
    <KitButton @click="decrypt">
      Decrypt
    </KitButton>
  </div>
  <KitFormU8
    v-model:buffer="P"
    :codec="HEX"
    title="Plain text"
    textarea
  />
  <KitFormU8
    v-model:buffer="C"
    :codec="HEX"
    title="Cipher text"
    textarea
  />

  <div
    v-if="mode.ALGORITHM === 'GCM'"
    class="divider my-8"
  >
    <KitButton @click="sign">
      Sign
    </KitButton>/
    <KitButton @click="verify">
      Verify
    </KitButton>
  </div>
  <KitFormU8
    v-if="mode.ALGORITHM === 'GCM'"
    v-model:buffer="A"
    :codec="HEX"
    title="Additional Data"
  />
  <KitFormU8
    v-if="mode.ALGORITHM === 'GCM'"
    v-model:buffer="T"
    :codec="HEX"
    title="Auth Tag"
  />
</template>
