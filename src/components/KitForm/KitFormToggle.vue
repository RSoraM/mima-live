<script setup lang="ts">
defineOptions({ name: 'KitFormToggle' });
defineProps<{ title: string }>();
const model = defineModel<boolean>();
</script>

<template>
  <div class="form-control">
    <label class="label cursor-pointer">
      <span class="label-text text-xs">{{ title }}</span>
      <input v-model="model" type="checkbox" class="toggle">
    </label>
  </div>
</template>
