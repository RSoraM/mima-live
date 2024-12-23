<script setup lang="ts">
import type { Codec, U8 } from 'mima-kit';

defineOptions({ name: 'KitFormU8' });
const { textarea = false, codec = HEX } = defineProps<{ title: string; textarea?: boolean; codec?: Codec }>();
const buffer = defineModel<U8>({ required: true });
</script>

<template>
  <KitFormControl :title="title">
    <KitFormU8Base v-model="buffer" :codec="codec" :textarea="textarea" />
  </KitFormControl>
</template>
