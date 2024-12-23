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
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      XTEA
    </h1>

    <KitFormNumber v-model="r" title="Rounds" />

    <div class="divider my-8">
      Operation Mode Config
    </div>

    <KitFormModeConfig :cipher="alg" :init="init" />

    <div class="stats stats-vertical my-6 shadow">
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

      <KitStat title="Key Size (bytes)">
        {{ alg.KEY_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ alg.BLOCK_SIZE }}
      </KitStat>
    </div>
  </div>
</template>
