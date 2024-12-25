<script setup lang="ts">
defineOptions({ name: 'DES' });

const init = {
  k: '0123456789ABCDEF',
  iv: '0123456789ABCDEF',
  a: '',
  t: '',
  p: '0123456789ABCDEF',
  c: 'd5d44ff720683d0dd41177bb2aa9742f',
};
</script>

<template>
  <h1 class="mx-auto mb-4 text-4xl font-bold md:my-8 md:mb-0">
    DES
  </h1>

  <KitDivider>
    Operation Mode Config
  </KitDivider>

  <KitFormMode :block-cipher="des" :init="init" />

  <div class="stats stats-vertical my-6 shadow">
    <KitStat title="Specification">
      <KitRefLink
        :texts="['NIST', 'FIPS.46-3']"
        icon="icon-[carbon--pdf-reference]"
        href="https://csrc.nist.gov/files/pubs/fips/46-3/final/docs/fips46-3.pdf"
      />
    </KitStat>

    <KitStat title="First published">
      1975
    </KitStat>

    <KitStat title="Key Size (byte)">
      {{ des.KEY_SIZE }}
    </KitStat>

    <KitStat title="Block Size (byte)">
      {{ des.BLOCK_SIZE }}
    </KitStat>
  </div>
</template>
