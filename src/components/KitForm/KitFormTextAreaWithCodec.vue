<script setup lang="ts">
import type { Codec } from 'mima-kit';
import KitFormControl from './KitFormControl.vue';

defineOptions({ name: 'KitFormTextAreaWithCodec' });
defineProps<{ title: string }>();

const text = defineModel<string>('text');
const codec = defineModel<Codec>('codec');
</script>

<template>
  <KitFormControl :title="title">
    <div class="join join-vertical flex flex-col">
      <KitBaseFormCodecSelect v-model="codec" class="join-item" />
      <textarea v-model="text" class="join-item textarea textarea-bordered h-24 text-xs" />
    </div>
  </KitFormControl>
</template>
