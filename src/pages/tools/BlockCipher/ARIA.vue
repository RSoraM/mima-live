<script setup lang="ts">
defineOptions({ name: 'ARIA' });

const b = ref<128 | 192 | 256>(128);
const alg = computed(catchNotifySync(() => aria(b.value)));
const variant_options: SelectOption[] = [
  { label: '128', value: 128 },
  { label: '192', value: 192 },
  { label: '256', value: 256 },
];
const init = {
  k: '0123456789ABCDEFFEDCBA9876543210',
  iv: '0123456789ABCDEFFEDCBA9876543210',
  a: '0123456789ABCDEFFEDCBA9876543210',
  t: '75efe01726c037f9b3a5c99ffa3e5575',
  p: '0123456789ABCDEFFEDCBA9876543210',
  c: '0d8343e85790c4517171800c71657d9c0631dcfed31b6d384235e842783eb441',
};
</script>

<template>
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    ARIA-{{ b }}
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
        :texts="['RFC 5794']"
        icon="icon-[carbon--txt-reference]"
        href="https://www.rfc-editor.org/rfc/rfc5794.txt"
      />
    </KitStat>

    <KitStat title="First published">
      2003
    </KitStat>

    <KitStat title="Key Size (byte)">
      {{ alg.KEY_SIZE }}
    </KitStat>

    <KitStat title="Block Size (byte)">
      {{ alg.BLOCK_SIZE }}
    </KitStat>
  </div>
</template>
