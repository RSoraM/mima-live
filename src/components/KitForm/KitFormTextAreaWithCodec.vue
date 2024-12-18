<script setup lang="ts">
import type { Codec } from 'mima-kit';
import { HEX } from 'mima-kit';
import KitFormControl from './KitFormControl.vue';

defineOptions({ name: 'KitFormTextAreaWithCodec' });
defineProps<{ title: string }>();
const text = defineModel<string>('text', { default: '' });
const codec = defineModel<Codec>('codec', { default: HEX });
watch(codec, (new_codec, old_codec) => {
  text.value = new_codec(old_codec(text.value));
});
</script>

<template>
  <KitFormControl :title="title">
    <div class="join join-vertical">
      <KitBaseFormCodecSelect v-model="codec" class="join-item" />
      <textarea v-model="text" class="join-item textarea textarea-bordered h-24 text-xs" />
    </div>
  </KitFormControl>
</template>
