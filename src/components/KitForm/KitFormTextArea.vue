<script setup lang="ts">
defineOptions({ name: 'KitFormTextArea' });
defineProps<{ title: string }>();
const model = defineModel<string>();
</script>

<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title }}</span>
    </div>
    <textarea v-model="model" class="textarea textarea-bordered h-24" />
  </label>
</template>
