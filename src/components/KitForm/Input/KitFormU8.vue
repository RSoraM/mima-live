<script setup lang="ts">
defineOptions({ name: 'KitFormU8' });

const { textarea = false } = defineProps<{
  codec: typeof HEX;
  title: string;
  textarea?: boolean;
}>();
const buffer = defineModel<InstanceType<typeof U8>>({ required: true });
</script>

<template>
  <KitFormControl :title="title">
    <KitFormU8Base v-model="buffer" :codec="codec" :textarea="textarea" />
  </KitFormControl>
</template>
