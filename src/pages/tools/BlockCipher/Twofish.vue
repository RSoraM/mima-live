<script setup lang="ts">
defineOptions({ name: 'Twofish' });

const b = ref<128 | 192 | 256>(128);
const alg = computed(catchNotifySync(() => twofish(b.value)));
const variant_options: SelectOption[] = [
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
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    Twofish-{{ b }}
  </h1>

  <KitFormSelect
    v-model="b"
    :options="variant_options"
    title="Key Size (bit)"
  />

  <KitDivider>
    Operation Mode Config
  </KitDivider>

  <KitFormMode :block-cipher="alg" :init="init" />

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

    <KitStat title="Key Size (byte)">
      {{ alg.KEY_SIZE }}
    </KitStat>

    <KitStat title="Block Size (byte)">
      {{ alg.BLOCK_SIZE }}
    </KitStat>
  </div>
</template>
