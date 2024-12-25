<script setup lang="ts">
defineOptions({ name: 'Blowfish' });

const init = {
  k: '0123456789ABCDEFFEDCBA9876543210',
  iv: '0123456789ABCDEF',
  a: '',
  t: '',
  p: '0123456789ABCDEF',
  c: '4e1cb595fca184b40b62acf56e014756',
};
</script>

<template>
  <h1 class="mx-auto mb-4 text-4xl font-bold md:my-8 md:mb-0">
    Blowfish
  </h1>

  <KitDivider>
    Operation Mode Config
  </KitDivider>

  <KitFormMode :block-cipher="blowfish" :init="init" />

  <div class="stats stats-vertical my-6 shadow">
    <KitStat title="Specification">
      <KitRefLink
        :texts="['Blowfish']"
        icon="icon-[carbon--html-reference]"
        href="https://www.schneier.com/academic/blowfish/"
      />
    </KitStat>

    <KitStat title="First published">
      1993
    </KitStat>

    <KitStat title="Key Size (byte)">
      4 - {{ blowfish.KEY_SIZE }}
    </KitStat>

    <KitStat title="Block Size (byte)">
      {{ blowfish.BLOCK_SIZE }}
    </KitStat>
  </div>
</template>
