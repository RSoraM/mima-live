<script setup lang="ts">
import { twofish } from 'mima-kit';

defineOptions({ name: 'Twofish' });

const b = ref<128 | 192 | 256>(128);
const alg = computed(catchNotifySync(() => twofish(b.value)));
const variantOptions: SelectOption[] = [
  { label: '128', value: 128 },
  { label: '192', value: 192 },
  { label: '256', value: 256 },
];
const init = {
  k: '0123456789ABCDEFFEDCBA9876543210',
  iv: '0123456789ABCDEFFEDCBA9876543210',
  a: '0123456789ABCDEFFEDCBA9876543210',
  t: '27c8e29a1e72c6a54dfaf75005b46721',
  p: '0123456789ABCDEFFEDCBA9876543210',
  c: 'dfbdf399d0d3112ed11900427bf1f9f47445e31b3e49ececa5106de329fc2683',
};
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      Twofish-{{ b }}
    </h1>

    <KitFormControl title="Key Size (bits)">
      <KitBaseFormSelect v-model="b" :options="variantOptions" />
    </KitFormControl>

    <div class="divider my-8">
      Operation Mode Config
    </div>

    <KitFormModeConfig :cipher="alg" :init="init" />

    <div class="stats stats-vertical my-6 shadow">
      <KitStat title="Specification">
        <KitRefLink
          :texts="['Twofish']"
          icon="icon-[carbon--html-reference]"
          href="https://www.schneier.com/academic/twofish/"
        />
      </KitStat>

      <KitStat title="First published">
        1998
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
