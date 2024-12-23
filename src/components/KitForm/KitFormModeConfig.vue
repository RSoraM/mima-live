<script setup lang="ts">
defineOptions({ name: 'KitFormModeConfig' });

const { blockCipher: block_cipher, init } = defineProps<{
  blockCipher: typeof sm4;
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
const padding = ref(PKCS7_PAD);
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

const mod_cipher = computed(() => mode.value(block_cipher, padding.value, t_size.value));

const encrypt = catchNotify(() => {
  const cipher = mod_cipher.value;
  C.value = cipher(K.value, IV.value).encrypt(P.value);
});
const decrypt = catchNotify(() => {
  const cipher = mod_cipher.value;
  P.value = cipher(K.value, IV.value).decrypt(C.value);
});
const sign = catchNotify(() => {
  if (mode.value !== gcm)
    throw new Error('Only GCM mode supports signing');
  const cipher = mod_cipher.value as ReturnType<typeof gcm>;
  C.value = cipher(K.value, IV.value).encrypt(P.value);
  T.value = cipher(K.value, IV.value).sign(C.value, A.value);
});
const verify = catchNotify(() => {
  if (mode.value !== gcm)
    throw new Error('Only GCM mode supports verifying');
  const cipher = mod_cipher.value as ReturnType<typeof gcm>;
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
</script>

<template>
  <div class="flex gap-2">
    <KitFormSelectMode v-model="mode" :blocksize="block_cipher.BLOCK_SIZE" />
    <KitFormSelectPadding v-model="padding" :mode="mode" />
  </div>
  <KitFormU8
    v-model="K"
    :codec="HEX"
    title="Key"
  />
  <KitFormU8
    v-show="mode.ALGORITHM !== 'ECB'"
    v-model="IV"
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
    v-model="P"
    :codec="HEX"
    title="Plain text"
    textarea
  />
  <KitFormU8
    v-model="C"
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
    v-model="A"
    :codec="HEX"
    title="Additional Data"
  />
  <KitFormU8
    v-if="mode.ALGORITHM === 'GCM'"
    v-model="T"
    :codec="HEX"
    title="Auth Tag"
  />
</template>
