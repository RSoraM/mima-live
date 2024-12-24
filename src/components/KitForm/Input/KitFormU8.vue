<script setup lang="ts">
defineOptions({ name: 'KitFormU8' });

const { textarea = false, immediate = false } = defineProps<{
  codec: typeof HEX;
  title?: string;
  textarea?: boolean;
  immediate?: boolean;
}>();
const buffer = defineModel<InstanceType<typeof U8>>({ required: true });
</script>

<template>
  <KitFormControl :title="title">
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
