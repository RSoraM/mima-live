<script setup lang="ts">
import { HEX, salsa20, UTF8 } from 'mima-kit';

defineOptions({ name: 'Salsa20' });

const k = ref('0123456789abcdeffedcba9876543210');
const k_codec = ref(HEX);
const iv = ref('0123456789abcdef');
const iv_codec = ref(HEX);
const p = ref('mima-kit');
const p_codec = ref(UTF8);
const c = ref('8d937ab72610eeb3');
const c_codec = ref(HEX);

function createCipher() {
  const K = k_codec.value.parse(k.value);
  const IV = iv_codec.value.parse(iv.value);
  return salsa20(K, IV);
}
const encrypt = catchNotify(() => {
  const cipher = createCipher();
  const P = p_codec.value.parse(p.value);
  const res = cipher._encrypt(P);
  c.value = c_codec.value.stringify(res);
});
const decrypt = catchNotify(() => {
  const cipher = createCipher();
  const C = c_codec.value.parse(c.value);
  const res = cipher._decrypt(C);
  p.value = p_codec.value.stringify(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      Salsa20
    </h1>
    <KitFormInputWithCodec v-model:text="k" v-model:codec="k_codec" title="Key" />
    <KitFormInputWithCodec v-model:text="iv" v-model:codec="iv_codec" title="IV" />
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
