<script setup lang="ts">
defineOptions({ name: 'Rabbit' });

const K = ref(HEX('0123456789abcdeffedcba9876543210'));
const IV = ref(HEX('0123456789abcdef'));
const P = ref(UTF8('mima-kit'));
const C = ref(HEX('818c4eabd42d0e79'));

function createCipher() {
  return rabbit(K.value, IV.value);
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
  <ToolsLayout title="Rabbit">
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
          :texts="['RFC 4503']"
          icon="icon-[carbon--txt-reference]"
          href="https://www.rfc-editor.org/rfc/rfc4503.txt"
        />
      </KitStat>
      <KitStat title="First published">
        2003
      </KitStat>
      <KitStat title="Key Size (byte)">
        {{ rabbit.KEY_SIZE }}
      </KitStat>
      <KitStat title="IV Size (byte)">
        {{ rabbit.MIN_IV_SIZE }} or {{ rabbit.MAX_IV_SIZE }}
      </KitStat>
    </template>
  </ToolsLayout>
</template>
