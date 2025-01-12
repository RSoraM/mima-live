<script setup lang="ts">
defineOptions({ name: 'XTEA' });

const r = ref(32);
const alg = computed(catchNotifySync(() => xtea(r.value)));
const init = {
  k: '0123456789ABCDEFFEDCBA9876543210',
  iv: '0123456789ABCDEF',
  a: '',
  t: '',
  p: '0123456789ABCDEF',
  c: '22357206cb9426f9a997009a50d265fd',
};
</script>

<template>
  <ToolsLayout title="XTEA">
    <KitFormNumber v-model="r" title="Rounds" />
    <KitFormMode :block-cipher="alg" :init="init" />

    <template #stat>
      <KitStat title="Specification">
        <KitRefLink
          :texts="['XTEA']"
          icon="icon-[carbon--pdf-reference]"
          href="https://www.cix.co.uk/~klockstone/xtea.pdf"
        />
      </KitStat>
      <KitStat title="First published">
        1997
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
