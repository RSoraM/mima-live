<script setup lang="ts">
defineOptions({ name: 'KitFormSelect' });
defineProps<{
  title: string;
  options: SelectOption[];
}>();
const model = defineModel();
</script>

<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title }}</span>
    </div>
    <select v-model="model" class="select select-bordered text-xs">
      <option
        v-for="option in options" :key="option.label"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
