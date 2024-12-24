<script setup lang="ts">
defineOptions({ name: 'KitFormU8Base' });

const { textarea = false, codec = HEX, immediate = false } = defineProps<{
  textarea?: boolean;
  codec?: typeof HEX;
  immediate?: boolean;
}>();
const buffer = defineModel<InstanceType<typeof U8>>({ required: true });
const text_codec = ref(codec);
const auto = useTextareaAutosize({ styleProp: 'minHeight' });
const text = auto.input;
const size = auto.textarea;

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
  <div
    v-if="textarea"
    class="join join-vertical"
  >
    <KitFormSelectCodec v-model="text_codec" />
    <textarea
      ref="size"
      v-model="text"
      class="join-item textarea textarea-bordered h-24 w-full text-xs"
      name="textarea"
      spellcheck="false"
      @change="t2b"
    />
  </div>
  <div
    v-else
    class="join join-vertical md:join-horizontal"
  >
    <KitFormSelectCodec v-model="text_codec" />
    <input
      v-model="text" type="text"
      class="input join-item input-bordered w-full text-xs"
      name="text"
      spellcheck="false"
      @change="t2b"
    >
    <slot />
  </div>
</template>
