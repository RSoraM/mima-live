<script setup lang="ts">
defineOptions({ name: 'XXTEA' });

const padding = ref(PKCS7_PAD);
const round = ref(0);
const P = ref(UTF8('mima-kit'));
const K = ref(HEX('0123456789ABCDEFFEDCBA9876543210'));
const C = ref(HEX('f5f55973f831fc6ba313c518'));
const algRaw = computed(() => xxtea({
  padding: padding.value,
  round: round.value,
}));
const encrypt = catchNotifySync(
  () => C.value = algRaw.value(K.value).encrypt(P.value),
);
const decrypt = catchNotifySync(
  () => P.value = algRaw.value(K.value).decrypt(C.value),
);

const no_pad = ref(NO_PAD);
const block_size = ref(16);
const alg = computed(() => xxtea({
  padding: NO_PAD,
  BLOCK_SIZE: block_size.value,
  round: round.value,
}));
const init = {
  k: '0123456789ABCDEFFEDCBA9876543210',
  iv: '0123456789ABCDEFFEDCBA9876543210',
  a: '',
  t: '',
  p: '0123456789ABCDEF',
  c: 'dd45267cdb59dcfadebb96d84dbc79d4',
};
</script>

<template>
  <ToolsLayout title="XXTEA">
    <KitFoldCard title="Original">
      <template #action>
        <KitButton @click="encrypt">
          Encrypt
        </KitButton>
        <KitButton @click="decrypt">
          Decrypt
        </KitButton>
      </template>
      <ul class="mb-2 ml-6 list-disc text-xs">
        <li>
          you can skip padding by setting padding to <b><u>None Padding</u></b>.
          But the plaintext must be a multiple of 4 bytes.
        </li>
        <li>
          if <b><u>Rounds === 0</u></b>, the default round calculation method
          <b><u>(Rounds = 6 + 52 / n)</u></b> will be used.
        </li>
      </ul>
      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-2">
        <KitFormSelectPadding v-model="padding" :mode="gcm" title="Padding" />
        <KitFormNumber v-model="round" title="Rounds" />
      </div>
      <KitFormU8 v-model="K" :codec="HEX" title="Key" />
      <KitFormU8 v-model="P" :codec="UTF8" textarea title="Plaintext" />
      <KitFormU8 v-model="C" :codec="HEX" textarea title="Ciphertext" />
    </KitFoldCard>

    <KitInfo>
      <b><u>XXTEA</u></b> is natively designed to encrypt arbitrary amounts of data blocks.
      But <b><u>mima-kit</u></b> also allow you using <b><u>XXTEA</u></b>
      with <b><u>Operation Mode</u></b> (such as <b><u>CBC</u></b> mode), just like other block ciphers.
    </KitInfo>

    <ul class="mb-2 ml-6 list-decimal text-xs">
      <li>
        Note: This is not the standard usage of <b><u>XXTEA</u></b> and lacks relevant security analysis.
      </li>
      <li>
        Set the padding to <b><u>None Padding</u></b> and let the <b><u>Operation Mode</u></b> handle the padding.
      </li>
      <li>
        Set <b><u>Block Size</u></b> to control the size of the data block processed each time in <b><u>Operation Mode</u></b>.
      </li>
      <li>
        if <b><u>Rounds === 0</u></b>, the default round calculation method
        <b><u>(Rounds = 6 + 52 / n)</u></b> will be used.
      </li>
    </ul>

    <KitFormSelectPadding v-model="no_pad" :mode="gcm" title="Padding" disabled />
    <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-2">
      <KitFormNumber v-model="block_size" title="Block Size (byte)" :step="4" />
      <KitFormNumber v-model="round" title="Rounds" />
    </div>
    <KitFormMode :block-cipher="alg" :init="init" />

    <template #stat>
      <KitStat title="Specification">
        <KitRefLink
          :texts="['XXTEA']"
          icon="icon-[carbon--pdf-reference]"
          href="https://www.cix.co.uk/~klockstone/xxtea.pdf"
        />
      </KitStat>
      <KitStat title="First published">
        1998
      </KitStat>
      <KitStat title="Key Size (byte)">
        {{ alg.KEY_SIZE }}
      </KitStat>
      <KitStat title="Block Size (byte)">
        {{ alg.BLOCK_SIZE }}
      </KitStat>
    </template>
  </ToolsLayout>
</template>
