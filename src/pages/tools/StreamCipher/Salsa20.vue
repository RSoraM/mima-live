<script setup lang="ts">
defineOptions({ name: 'Salsa20' });

const K = ref(HEX('0123456789abcdeffedcba9876543210'));
const IV = ref(HEX('0123456789abcdef'));
const P = ref(UTF8('mima-kit'));
const C = ref(HEX('8d937ab72610eeb3'));

function createCipher() {
  return salsa20(K.value, IV.value);
}
const encrypt = catchNotify(() => {
  const cipher = createCipher();
  C.value = cipher.encrypt(P.value);
});
const decrypt = catchNotify(() => {
  const cipher = createCipher();
  P.value = cipher.decrypt(C.value);
});
</script>

<template>
  <ToolsLayout title="Salsa20">
    <div>
      <KitFormU8 v-model="K" title="Key" :codec="HEX" />
      <KitFormU8 v-model="IV" title="IV" :codec="HEX" />
    </div>
    <KitFoldCard title="Encryption">
      <template #action>
        <KitButton @click="encrypt">
          Encrypt
        </KitButton>
        <KitButton @click="decrypt">
          Decrypt
        </KitButton>
      </template>
      <KitFormU8 v-model="P" title="Plain text" textarea :codec="UTF8" />
      <KitFormU8 v-model="C" title="Cipher text" textarea :codec="HEX" />
    </KitFoldCard>

    <template #stat>
      <KitStat title="Specification">
        <KitRefLink
          :texts="['Salsa20']"
          icon="icon-[carbon--pdf-reference]"
          href="https://cr.yp.to/snuffle/spec.pdf"
        />
      </KitStat>
      <KitStat title="First published">
        2007
      </KitStat>
      <KitStat title="Key Size (byte)">
        {{ salsa20.MIN_KEY_SIZE }} or {{ salsa20.MAX_KEY_SIZE }}
      </KitStat>
      <KitStat title="IV Size (byte)">
        {{ salsa20.IV_SIZE }}
      </KitStat>
    </template>
  </ToolsLayout>
</template>
