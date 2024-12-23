<script setup lang="ts">
import { ISO7816_PAD, NO_PAD, PKCS7_PAD, X923_PAD, ZERO_PAD } from 'mima-kit';

defineOptions({ name: 'KitFormSelectPadding' });
defineProps<{ title?: string }>();
const padding = defineModel<typeof PKCS7_PAD>('padding');
const disableNoPad = defineModel<boolean>('disableNoPad');

const options = computed<SelectOption[]>(() => ([
  { label: 'PKCS#7', value: PKCS7_PAD },
  { label: 'ANSI X9.23', value: X923_PAD },
  { label: 'ISO 7816-4', value: ISO7816_PAD },
  { label: 'Zero Padding', value: ZERO_PAD },
  { label: 'None Padding', value: NO_PAD, disable: disableNoPad.value },
]));
</script>

<template>
  <KitFormControl :title="title || 'Padding'">
    <KitBaseFormSelect v-model="padding" :options="options" />
  </KitFormControl>
</template>
