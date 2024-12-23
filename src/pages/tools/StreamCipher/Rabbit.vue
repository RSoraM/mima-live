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
  <h1 class="mx-auto text-4xl font-bold md:my-8">
    Rabbit
  </h1>
  <KitFormU8
    v-model="K"
    :codec="HEX"
    title="Key"
  />
  <KitFormU8
    v-model="IV"
    :codec="HEX"
    title="IV"
  />
  <KitDivider>
    <KitButton @click="encrypt">
      Encrypt
    </KitButton>/
    <KitButton @click="decrypt">
      Decrypt
    </KitButton>
  </KitDivider>
  <KitFormU8
    v-model="P"
    :codec="UTF8"
    title="Plain text"
    textarea
  />
  <KitFormU8
    v-model="C"
    :codec="HEX"
    title="Cipher text"
    textarea
  />

  <div class="stats stats-vertical my-6 shadow">
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
      16
    </KitStat>

    <KitStat title="IV Size (byte)">
      0 or 8
    </KitStat>
  </div>
</template>
