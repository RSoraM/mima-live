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
  <div>
    <h1 class="mx-auto text-4xl font-bold md:mt-8">
      Blowfish
    </h1>

    <div class="divider my-8">
      Operation Mode Config
    </div>

    <KitFormModeConfig :block-cipher="blowfish" :init="init" />

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

      <KitStat title="Key Size (bytes)">
        4 - {{ blowfish.KEY_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ blowfish.BLOCK_SIZE }}
      </KitStat>
    </div>
  </div>
</template>
