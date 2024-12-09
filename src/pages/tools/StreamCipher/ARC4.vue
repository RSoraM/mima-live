<script setup lang="ts">
import { arc4, HEX, UTF8 } from 'mima-kit';

defineOptions({ name: 'ARC4' });

const k = ref('0123456789abcdef');
const k_codec = ref(HEX);
const p = ref('mima-kit');
const p_codec = ref(UTF8);
const c = ref('19fdaf863d20610d');
const c_codec = ref(HEX);

function createCipher() {
  const K = k_codec.value(k.value);
  return arc4(K);
}
const encrypt = catchNotify(() => {
  const cipher = createCipher();
  const P = p_codec.value(p.value);
  const res = cipher.encrypt(P);
  c.value = c_codec.value(res);
});
const decrypt = catchNotify(() => {
  const cipher = createCipher();
  const C = c_codec.value(c.value);
  const res = cipher.decrypt(C);
  p.value = p_codec.value(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      ARC4
    </h1>
    <KitFormInputWithCodec v-model:text="k" v-model:codec="k_codec" title="Key" />
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
          :texts="['ARC4']"
          icon="icon-[carbon--html-reference]"
          href="https://en.wikipedia.org/wiki/RC4"
        />
      </KitStat>

      <KitStat title="First published">
        1994
      </KitStat>

      <KitStat title="Key Size (bytes)">
        5-256
      </KitStat>
    </div>
  </div>
</template>
