<script setup lang="ts">
defineOptions({ name: 'KitFormNumber' });

const {
  titlePrefix = '',
  title = '',
  titleSuffix = '',
  type = 'number',
} = defineProps<{
  titlePrefix?: string;
  title?: string;
  titleSuffix?: string;
  type?: string;
}>();
const step = title?.endsWith('(bit)') ? 8 : 1;
const model = defineModel<string | number>();
</script>

<template>
  <KitFormControl
    :title-prefix="titlePrefix"
    :title="title"
    :title-suffix="titleSuffix"
  >
    <input
      v-model="model" :type="type" :step="step"
      class="input input-bordered text-xs"
      name="number"
      :="$attrs"
    >
  </KitFormControl>
</template>
