<script setup lang="ts">
defineOptions({ name: 'SM3' });

const I = ref(UTF8('mima-kit'));
const O = ref(new U8());

watchEffect(catchNotifySync(() => {
  O.value = sm3(I.value);
}));
</script>

<template>
  <ToolsLayout title="SM3">
    <template #body>
      <KitFormU8 v-model="I" title="Input" :immediate="true" textarea :codec="UTF8" />
      <KitFormU8 v-model="O" title="Output" textarea :codec="HEX" />
    </template>
    <template #stat>
      <KitStat title="Specification">
        <KitRefLink
          :texts="['GM/T', '0004-2012']"
          icon="icon-[carbon--pdf-reference]"
          href="https://oscca.gov.cn/sca/xxgk/2010-12/17/1002389/files/302a3ada057c4a73830536d03e683110.pdf"
        />
      </KitStat>
      <KitStat title="First published">
        2010
      </KitStat>
      <KitStat title="Digest Size (byte)">
        {{ sm3.DIGEST_SIZE }}
      </KitStat>
      <KitStat title="Block Size (byte)">
        {{ sm3.BLOCK_SIZE }}
      </KitStat>
      <KitStat title="Structure">
        Merkle-Damgård
      </KitStat>
      <KitStat title="Round">
        64
      </KitStat>
    </template>
  </ToolsLayout>
</template>
