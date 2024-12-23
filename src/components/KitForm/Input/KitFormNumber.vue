<script setup lang="ts">
defineOptions({ name: 'KitFormNumber' });

const { title, type = 'number' } = defineProps<{
  title: string;
  type?: string;
}>();
const step = title.endsWith('(bit)') ? 8 : 1;

const model = defineModel<string | number>();
</script>

<template>
  <KitFormControl :title="title">
    <input
      v-model="model" :type="type" :step="step"
      class="input input-bordered text-xs"
      name="number"
    >
  </KitFormControl>
</template>
