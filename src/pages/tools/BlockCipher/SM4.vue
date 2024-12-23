<script setup lang="ts">
defineOptions({ name: 'SM4' });

const init = {
  k: '0123456789ABCDEFFEDCBA9876543210',
  iv: '0123456789ABCDEFFEDCBA9876543210',
  a: '0123456789ABCDEFFEDCBA9876543210',
  t: '36a95cdb0e2d3293e7a2a7a0234ad6d7',
  p: '0123456789ABCDEFFEDCBA9876543210',
  c: '2677f46b09c122cc975533105bd4a22a3b880e6867772522ae55d2f0ae7478ae',
};
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:mt-8">
      SM4
    </h1>

    <KitDivider>
      Operation Mode Config
    </KitDivider>

    <KitFormModeConfig :block-cipher="sm4" :init="init" />

    <div class="stats stats-vertical my-6 shadow">
      <KitStat title="Specification">
        <KitRefLink
          :texts="['GM/T', '0002-2012']"
          icon="icon-[carbon--pdf-reference]"
          href="http://www.gmbz.org.cn/upload/2018-04-04/1522788048733065051.pdf"
        />
      </KitStat>

      <KitStat title="First published">
        2012
      </KitStat>

      <KitStat title="Key Size (byte)">
        {{ sm4.KEY_SIZE }}
      </KitStat>

      <KitStat title="Block Size (byte)">
        {{ sm4.BLOCK_SIZE }}
      </KitStat>
    </div>
  </div>
</template>
