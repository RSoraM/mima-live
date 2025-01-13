<script setup lang="ts">
defineOptions({ name: 'ARC5' });

const b = ref<8 | 16 | 32 | 64 | 128>(64);
const r = ref(20);
const alg = computed(catchNotifySync(() => arc5(b.value, r.value)));
const variant_options: SelectOption[] = [
  { label: '8', value: 8 },
  { label: '16', value: 16 },
  { label: '32', value: 32 },
  { label: '64', value: 64 },
  { label: '128', value: 128 },
];
const init = {
  k: '0123456789ABCDEFFEDCBA9876543210',
  iv: '0123456789ABCDEFFEDCBA9876543210',
  a: '0123456789ABCDEFFEDCBA9876543210',
  t: '5540286ab5a3e7e80cf7103c009a4edf',
  p: '0123456789ABCDEFFEDCBA9876543210',
  c: '34d7f427716218cd49b27b74040e3a50deb001425642be2baae0fd2e461efc38',
};
</script>

<template>
  <ToolsLayout :title="`ARC5-${b}/${r}`">
    <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-2">
      <KitFormSelect v-model="b" title="Word Size (bit)" :options="variant_options" />
      <KitFormNumber v-model="r" title="Rounds" />
    </div>
    <KitFormMode :block-cipher="alg" :init="init" />
    <KitFoldCard title="Suggestions Spec">
      <table class="table table-zebra table-sm">
        <thead>
          <tr>
            <th>Word Size (byte)</th>
            <th>rounds</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>8</td>
            <td>8</td>
          </tr>
          <tr>
            <td>16</td>
            <td>12</td>
          </tr>
          <tr>
            <td>32</td>
            <td>16</td>
          </tr>
          <tr>
            <td>64</td>
            <td>20</td>
          </tr>
          <tr>
            <td>128</td>
            <td>32</td>
          </tr>
        </tbody>
      </table>
    </KitFoldCard>

    <template #stat>
      <KitStat title="Specification">
        <KitRefLink
          :texts="['RC5']"
          icon="icon-[carbon--pdf-reference]"
          href="https://people.csail.mit.edu/rivest/pubs/Riv94.revised-1997-03-20.pdf"
        />
        <KitRefLink
          :texts="['RFC 2040']"
          icon="icon-[carbon--txt-reference]"
          href="https://www.rfc-editor.org/rfc/rfc2040.txt"
        />
      </KitStat>
      <KitStat title="First published">
        1994
      </KitStat>
      <KitStat title="Key Size (byte)">
        {{ alg.MIN_KEY_SIZE }} - {{ alg.MAX_KEY_SIZE }}
      </KitStat>
      <KitStat title="Block Size (byte)">
        {{ alg.BLOCK_SIZE }}
      </KitStat>
    </template>
  </ToolsLayout>
</template>
