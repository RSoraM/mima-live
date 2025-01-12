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
  <ToolsLayout title="Blowfish">
    <KitFormMode :block-cipher="blowfish" :init="init" />

    <template #stat>
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
        {{ blowfish.MIN_KEY_SIZE }}-{{ blowfish.MAX_KEY_SIZE }}
      </KitStat>
      <KitStat title="Block Size (byte)">
        {{ blowfish.BLOCK_SIZE }}
      </KitStat>
    </template>
  </ToolsLayout>
</template>
