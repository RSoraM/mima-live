<script setup lang="ts">
defineOptions({ name: 'KitFormMode' });

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
const mode_cipher = ref<ReturnType<Mode>>(cbc(sm4));
// key & iv
const K = ref(HEX(init?.k || ''));
const IV = ref(HEX(init?.iv || ''));
// plain text & cipher text
const P = ref(HEX(init?.p || ''));
const C = ref(HEX(init?.c || ''));
// additional data
const A = ref(HEX(init?.a || ''));
// auth tag
const T = ref(HEX(init?.t || ''));

const encrypt = catchNotify(() => {
  const cipher = mode_cipher.value(K.value, IV.value);
  C.value = cipher.encrypt(P.value);
});
const decrypt = catchNotify(() => {
  const cipher = mode_cipher.value(K.value, IV.value);
  P.value = cipher.decrypt(C.value);
});
const sign = catchNotify(() => {
  if (!mode_cipher.value.ALGORITHM.startsWith('GCM')) {
    throw new Error('Only GCM mode supports signing');
  }
  const cipher = mode_cipher.value(K.value, IV.value) as ReturnType<ReturnType<typeof gcm>>;
  C.value = cipher.encrypt(P.value);
  T.value = cipher.sign(C.value, A.value);
});
const verify = catchNotify(() => {
  if (!mode_cipher.value.ALGORITHM.startsWith('GCM')) {
    throw new Error('Only GCM mode supports verifying');
  }
  const cipher = mode_cipher.value(K.value, IV.value) as ReturnType<ReturnType<typeof gcm>>;
  if (!cipher.verify(T.value, C.value, A.value)) {
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
  <KitFormModeConfig v-model="mode_cipher" :block-cipher="block_cipher" />
  <KitFormU8 v-model="K" :codec="HEX" title="Key" />
  <template v-if="!mode_cipher.ALGORITHM.startsWith('ECB')">
    <KitFormU8 v-model="IV" :codec="HEX" title="IV" />
  </template>

  <KitDivider>
    <KitButton @click="encrypt">
      Encrypt
    </KitButton>/
    <KitButton @click="decrypt">
      Decrypt
    </KitButton>
  </KitDivider>
  <KitFormU8 v-model="P" :codec="HEX" title="Plain text" textarea />
  <KitFormU8 v-model="C" :codec="HEX" title="Cipher text" textarea />

  <template v-if="mode_cipher.ALGORITHM.startsWith('GCM')">
    <KitDivider>
      <KitButton @click="sign">
        Sign
      </KitButton>/
      <KitButton @click="verify">
        Verify
      </KitButton>
    </KitDivider>
    <KitFormU8 v-model="A" :codec="HEX" title="Additional Data" />
    <KitFormU8 v-model="T" :codec="HEX" title="Auth Tag" />
  </template>
</template>
