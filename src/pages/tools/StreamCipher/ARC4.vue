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
  <h1 class="mx-auto text-4xl font-bold md:my-8">
    ARC4
  </h1>
  <KitFormU8
    v-model="K"
    :codec="HEX"
    title="Key"
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
        :texts="['ARC4']"
        icon="icon-[carbon--html-reference]"
        href="https://en.wikipedia.org/wiki/RC4"
      />
    </KitStat>

    <KitStat title="First published">
      1994
    </KitStat>

    <KitStat title="Key Size (byte)">
      5-256
    </KitStat>
  </div>
</template>
