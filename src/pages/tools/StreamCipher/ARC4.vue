<script setup lang="ts">
defineOptions({ name: 'ARC4' });

const K = ref(HEX('0123456789abcdef'));
const P = ref(UTF8('mima-kit'));
const C = ref(HEX('19fdaf863d20610d'));

function createCipher() {
  return arc4(K.value);
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
  <ToolsLayout title="ARC4">
    <KitFormU8 v-model="K" :codec="HEX" title="Key" />
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
          :texts="['ARC4']"
          icon="icon-[carbon--html-reference]"
          href="https://en.wikipedia.org/wiki/RC4"
        />
      </KitStat>
      <KitStat title="First published">
        1994
      </KitStat>
      <KitStat title="Key Size (byte)">
        {{ arc4.MIN_KEY_SIZE }}-{{ arc4.MAX_KEY_SIZE }}
      </KitStat>
    </template>
  </ToolsLayout>
</template>
