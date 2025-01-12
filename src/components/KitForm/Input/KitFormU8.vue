<script setup lang="ts">
defineOptions({ name: 'KitFormU8' });

const {
  titlePrefix = '',
  title = '',
  titleSuffix = '',
  textarea = false,
  immediate = false,
} = defineProps<{
  codec: typeof HEX;
  titlePrefix?: string;
  title?: string;
  titleSuffix?: string;
  textarea?: boolean;
  immediate?: boolean;
}>();
const buffer = defineModel<InstanceType<typeof U8>>({ required: true });
</script>

<template>
  <KitFormControl
    :title-prefix="titlePrefix"
    :title="title"
    :title-suffix="titleSuffix"
  >
    <KitFormU8Base
      v-model="buffer"
      :="$attrs"
      :codec="codec"
      :textarea="textarea"
      :immediate="immediate"
    >
      <slot />
    </KitFormU8Base>
  </KitFormControl>
</template>
