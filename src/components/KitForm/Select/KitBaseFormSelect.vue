<script setup lang="ts">
defineOptions({ name: 'KitFormSelect' });
const { border = true } = defineProps<{ options: SelectOption[]; border?: boolean }>();
const model = defineModel();
</script>

<template>
  <select
    v-model="model"
    class="select text-xs"
    :class="border ? 'select-bordered' : ''"
  >
    <option
      v-for="option in options" :key="option.label"
      :value="option.value"
      :disabled="option.disable"
    >
      {{ option.label }}
    </option>
  </select>
</template>
