<script setup lang="ts">
defineOptions({ name: 'AES' });

const b = ref<128 | 192 | 256>(128);
const alg = computed(catchNotifySync(() => aes(b.value)));
const variant_options: SelectOption[] = [
  { label: '128', value: 128 },
  { label: '192', value: 192 },
  { label: '256', value: 256 },
];
const init = {
  k: '0123456789ABCDEFFEDCBA9876543210',
  iv: '0123456789ABCDEFFEDCBA9876543210',
  a: '0123456789ABCDEFFEDCBA9876543210',
  t: 'de11f15ae3fc0c40f592e793258562c7',
  p: '0123456789ABCDEFFEDCBA9876543210',
  c: 'd5c825a21f04643b43e2df3278a762f777fbe222811e7a9b3f7685bf4da6c00c',
};
</script>

<template>
  <ToolsLayout :title="`AES-${b}`">
    <KitFormSelect v-model="b" title="Key Size (bit)" :options="variant_options" />
    <KitFormMode :block-cipher="alg" :init="init" />

    <template #stat>
      <KitStat title="Specification">
        <KitRefLink
          :texts="['NIST', 'FIPS.197']"
          icon="icon-[carbon--pdf-reference]"
          href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197-upd1.pdf"
        />
      </KitStat>
      <KitStat title="First published">
        1998
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
