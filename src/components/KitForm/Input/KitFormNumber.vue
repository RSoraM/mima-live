<script setup lang="ts">
defineOptions({ name: 'KitFormNumber' });

const {
  titlePrefix = '',
  title = '',
  titleSuffix = '',
  type = 'number',
  step: prop_step = 0,
} = defineProps<{
  titlePrefix?: string;
  title?: string;
  titleSuffix?: string;
  step?: number;
  type?: string;
}>();
const step = prop_step || (title?.endsWith('(bit)')
  ? 8
  : 1);
const model = defineModel<string | number>();
</script>

<template>
  <KitFormControl
    :title-prefix="titlePrefix"
    :title="title"
    :title-suffix="titleSuffix"
  >
    <template #title>
      <slot name="title" />
    </template>
    <input
      v-model="model" :type="type" :step="step"
      class="input input-bordered text-xs"
      name="number"
      :="$attrs"
    >
  </KitFormControl>
</template>
