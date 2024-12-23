<script setup lang="ts">
defineOptions({ name: 'TEA' });

const r = ref(32);
const alg = computed(catchNotifySync(() => tea(r.value)));
const init = {
  k: '0123456789ABCDEFFEDCBA9876543210',
  iv: '0123456789ABCDEF',
  a: '',
  t: '',
  p: '0123456789ABCDEF',
  c: '73dc8539d02bd37e51a805978d557a36',
};
</script>

<template>
  <h1 class="mx-auto text-4xl font-bold md:my-8">
    TEA
  </h1>

  <KitFormNumber v-model="r" title="Rounds" />

  <KitDivider>
    Operation Mode Config
  </KitDivider>

  <KitFormModeConfig :block-cipher="alg" :init="init" />

  <div class="stats stats-vertical my-6 shadow">
    <KitStat title="Specification">
      <KitRefLink
        :texts="['TEA']"
        icon="icon-[carbon--pdf-reference]"
        href="https://www.cix.co.uk/~klockstone/tea.pdf"
      />
    </KitStat>

    <KitStat title="First published">
      1994
    </KitStat>

    <KitStat title="Key Size (byte)">
      {{ alg.KEY_SIZE }}
    </KitStat>

    <KitStat title="Block Size (byte)">
      {{ alg.BLOCK_SIZE }}
    </KitStat>
  </div>
</template>
