<script setup lang="ts">
defineOptions({ name: 'KitFormInput' });
const { type = 'text' } = defineProps<{ title: string; type?: string }>();
const model = defineModel<string | number>();
</script>

<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title }}</span>
    </div>
    <input v-model="model" :type="type" class="input input-bordered">
  </label>
</template>
