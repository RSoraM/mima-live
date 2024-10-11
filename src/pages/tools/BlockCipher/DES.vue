<script setup lang="ts">
import { des } from 'mima-kit';

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
  <div>
    <h1 class="mx-auto text-4xl font-bold md:mt-8">
      DES
    </h1>

    <div class="divider my-8">
      Mode Config
    </div>

    <KitFormModeConfig :cipher="des" :init="init" />

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

      <KitStat title="Key Size (bytes)">
        {{ des.KEY_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ des.BLOCK_SIZE }}
      </KitStat>
    </div>
  </div>
</template>
