<script setup lang="ts">
defineOptions({ name: 'KitFormSelect' });

const {
  titlePrefix = '',
  title = '',
  titleSuffix = '',
  border = true,
} = defineProps<{
  titlePrefix?: string;
  title?: string;
  titleSuffix?: string;
  options: SelectOption[];
  border?: boolean;
}>();
const model = defineModel();
</script>

<template>
  <KitFormControl
    :="$attrs"
    :title-prefix="titlePrefix"
    :title="title"
    :title-suffix="titleSuffix"
  >
    <select
      v-model="model"
      class="join-item select text-xs"
      :class="{ 'select-bordered': border }"
      name="selector"
      :="$attrs"
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
