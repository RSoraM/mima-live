<script setup lang="ts">
defineOptions({ name: 'KitFormToggle' });

defineProps<{ title?: string }>();
const model = defineModel<boolean>();
</script>

<template>
  <KitFormControl :title="title" type="toggle">
    <input
      v-model="model"
      type="checkbox"
      class="toggle"
      name="toggle"
    >
  </KitFormControl>
</template>
