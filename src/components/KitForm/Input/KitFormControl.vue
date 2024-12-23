<script setup lang="ts">
defineOptions({ name: 'KitFormControl' });
defineProps<{ title: string }>();
</script>

<template>
  <label class="form-control w-full">
    <div v-show="title" class="label">
      <span class="label-text text-xs">{{ title }}</span>
    </div>
    <slot />
  </label>
</template>
