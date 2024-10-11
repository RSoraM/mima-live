<script setup lang="ts">
defineOptions({ name: 'KitFormInput' });
const { type = 'text' } = defineProps<{ title: string; type?: string }>();
const model = defineModel<string | number>();
</script>

<template>
  <KitFormControl :title="title">
    <input
      v-model="model" :type="type"
      class="input input-bordered text-xs"
    >
  </KitFormControl>
</template>
