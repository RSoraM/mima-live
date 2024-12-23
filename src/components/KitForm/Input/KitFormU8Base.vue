<script setup lang="ts">
defineOptions({ name: 'KitFormU8Base' });

const { textarea = false, codec = HEX, immediate = false } = defineProps<{
  textarea?: boolean;
  codec?: typeof HEX;
  immediate?: boolean;
}>();
const buffer = defineModel<InstanceType<typeof U8>>({ required: true });
const text_codec = ref(codec);
const text = ref<string>('');

const t2b = () => buffer.value = text_codec.value(text.value);
watch(
  text,
  () => {
    if (immediate && text_codec.value === UTF8) {
      t2b();
    }
  },
);
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
  <div class="join" :class="{ 'join-vertical': textarea, 'join-vertical md:join-horizontal': !textarea }">
    <KitFormSelectCodec v-model="text_codec" class="join-item" />
    <textarea
      v-if="textarea"
      v-model="text" class="join-item textarea textarea-bordered h-24 text-xs"
      name="textarea"
      @change="t2b"
    />
    <input
      v-else
      v-model="text" type="text" class="input join-item input-bordered w-full text-xs"
      name="text"
      @change="t2b"
    >
    <slot />
  </div>
</template>
