<script setup lang="ts">
defineOptions({ name: 'Camellia' });

const b = ref<128 | 192 | 256>(128);
const alg = computed(() => camellia(b.value));
const variant_options: SelectOption[] = [
  { label: '128', value: 128 },
  { label: '192', value: 192 },
  { label: '256', value: 256 },
];
const init = {
  k: '0123456789ABCDEFFEDCBA9876543210',
  iv: '0123456789ABCDEFFEDCBA9876543210',
  a: '0123456789ABCDEFFEDCBA9876543210',
  t: '7e4ba4548a4b344728e5a996976fa752',
  p: '0123456789ABCDEFFEDCBA9876543210',
  c: 'a66b04401ed5f1aa85dd78ef5a31aeb82681e333616c78e8b9875812f51c2337',
};
</script>

<template>
  <ToolsLayout :title="`Camellia-${b}`">
    <KitFormSelect v-model="b" title="Key Size (bit)" :options="variant_options" />
    <KitFormMode :block-cipher="alg" :init="init" />

    <template #stat>
      <KitStat title="Specification">
        <KitRefLink
          :texts="['RFC 3713']"
          icon="icon-[carbon--txt-reference]"
          href="https://www.rfc-editor.org/rfc/rfc3713.txt"
        />
      </KitStat>
      <KitStat title="First published">
        2000
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
