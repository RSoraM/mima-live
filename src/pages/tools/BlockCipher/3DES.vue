<script setup lang="ts">
import { t_des } from 'mima-kit';

defineOptions({ name: '3DES' });

const b = ref<128 | 192>(192);
const alg = computed(catchNotifySync(() => t_des(b.value)));
const variantOptions: SelectOption[] = [
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
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      {{ b === 128 ? '2DES' : '3DES' }}
    </h1>

    <KitFormControl title="Key Size (bits)">
      <KitBaseFormSelect v-model="b" :options="variantOptions" />
    </KitFormControl>

    <div class="divider my-8">
      Mode Config
    </div>

    <KitFormModeConfig :cipher="alg" :init="init" />

    <div class="stats stats-vertical my-6 shadow">
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

      <KitStat title="Key Size (bytes)">
        {{ alg.KEY_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ alg.BLOCK_SIZE }}
      </KitStat>
    </div>
  </div>
</template>
