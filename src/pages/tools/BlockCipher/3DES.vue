<script setup lang="ts">
defineOptions({ name: '3DES' });

const b = ref<128 | 192>(192);
const alg = computed(() => t_des(b.value));
const variant_options: SelectOption[] = [
  { label: '128', value: 128 },
  { label: '192', value: 192 },
];
const init = {
  k: '0123456789ABCDEFFEDCBA98765432100123456789ABCDEF',
  iv: '0123456789ABCDEF',
  a: '',
  t: '',
  p: '0123456789ABCDEF',
  c: '08d7b4fb629d08854a1982e9c289a172',
};
</script>

<template>
  <ToolsLayout :title="b === 128 ? '2DES' : '3DES'">
    <KitFormSelect v-model="b" title="Key Size (bit)" :options="variant_options" />
    <KitFormMode :block-cipher="alg" :init="init" />

    <template #stat>
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
        {{ alg.KEY_SIZE }}
      </KitStat>
      <KitStat title="Block Size (byte)">
        {{ alg.BLOCK_SIZE }}
      </KitStat>
    </template>
  </ToolsLayout>
</template>
