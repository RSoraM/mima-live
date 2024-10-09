<script setup lang="ts">
defineOptions({ name: 'KitFormOutput' });
defineProps<{ title?: string }>();
const output = defineModel();
</script>

<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title }}</span>
    </div>
    <input v-model="output" type="text" class="input w-full text-xs" disabled>
  </label>
</template>
