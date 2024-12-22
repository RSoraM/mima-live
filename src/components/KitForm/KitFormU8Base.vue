<script setup lang="ts">
import type { Codec, U8 } from 'mima-kit';

defineOptions({ name: 'KitFormU8Base' });
const { textarea = false, codec = HEX } = defineProps<{ textarea?: boolean; codec?: Codec }>();
const buffer = defineModel<U8>('buffer', { required: true });
const text_codec = ref(codec);
const text = ref<string>('');

const t2b = () => buffer.value = text_codec.value(text.value);
onMounted(() => {
  watch(
    text_codec,
    (new_codec, old_codec) => text.value = old_codec(text.value).to(new_codec),
  );
  watchImmediate(
    buffer,
    () => text.value = buffer.value.to(text_codec.value),
  );
});
</script>

<template>
  <div class="join" :class="{ 'join-vertical': textarea }">
    <KitBaseFormCodecSelect v-model="text_codec" class="join-item" />
    <textarea
      v-if="textarea"
      v-model="text" :onblur="t2b"
      class="join-item textarea textarea-bordered h-24 text-xs"
    />
    <input
      v-else
      v-model="text" :onblur="t2b" type="text"
      class="input join-item input-bordered w-full text-xs"
    >
    <slot />
  </div>
</template>
