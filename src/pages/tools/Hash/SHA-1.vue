<script setup lang="ts">
defineOptions({ name: 'SHA1' });

const I = ref(UTF8('mima-kit'));
const O = ref(new U8());

watchEffect(catchNotifySync(() => {
  O.value = sha1(I.value);
}));
</script>

<template>
  <ToolsLayout title="SHA-1">
    <template #body>
      <KitFormU8 v-model="I" title="Input" :immediate="true" textarea :codec="UTF8" />
      <KitFormU8 v-model="O" title="Output" textarea :codec="HEX" />
    </template>
    <template #stat>
      <KitStat title="Specification">
        <KitRefLink
          :texts="['NIST', 'FIPS.180-4']"
          icon="icon-[carbon--pdf-reference]"
          href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf"
        />
      </KitStat>
      <KitStat title="First published">
        1993
      </KitStat>
      <KitStat title="Digest Size (byte)">
        {{ sha1.DIGEST_SIZE }}
      </KitStat>
      <KitStat title="Block Size (byte)">
        {{ sha1.BLOCK_SIZE }}
      </KitStat>
      <KitStat title="Structure">
        Merkle-Damgård
      </KitStat>
      <KitStat title="Round">
        80
      </KitStat>
    </template>
  </ToolsLayout>
</template>
