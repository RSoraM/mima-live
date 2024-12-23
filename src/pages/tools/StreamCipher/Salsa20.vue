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
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      Salsa20
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
          :texts="['Salsa20']"
          icon="icon-[carbon--pdf-reference]"
          href="https://cr.yp.to/snuffle/spec.pdf"
        />
      </KitStat>

      <KitStat title="First published">
        2007
      </KitStat>

      <KitStat title="Key Size (bytes)">
        16 or 32
      </KitStat>

      <KitStat title="IV Size (bytes)">
        8
      </KitStat>
    </div>
  </div>
</template>
