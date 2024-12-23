<script setup lang="ts">
defineOptions({ name: 'KitFormSelect' });

const { border = true } = defineProps<{
  options: SelectOption[];
  title?: string;
  border?: boolean;
}>();
const model = defineModel();
</script>

<template>
  <KitFormControl :title="title">
    <select
      v-model="model"
      class="select text-xs"
      :class="{ 'select-bordered': border }"
      name="selector"
    >
      <option
        v-for="option in options" :key="option.label"
        :value="option.value"
        :disabled="option.disable"
      >
        {{ option.label }}
      </option>
    </select>
  </KitFormControl>
</template>
