<script setup lang="ts">
import type { Codec } from 'mima-kit';
import { HEX } from 'mima-kit';
import KitFormControl from './KitFormControl.vue';

defineOptions({ name: 'KitFormInputWithCodec' });
defineProps<{ title: string }>();
const text = defineModel<string>('text', { default: '' });
const codec = defineModel<Codec>('codec', { required: false, default: HEX });
watch(codec, (new_codec, old_codec) => {
  text.value = new_codec(old_codec(text.value));
});
</script>

<template>
  <KitFormControl :title="title">
    <div class="join">
      <KitBaseFormSelectCodec v-model="codec" class="join-item" />
      <input v-model="text" type="text" class="input join-item input-bordered w-full text-xs">
    </div>
  </KitFormControl>
</template>
