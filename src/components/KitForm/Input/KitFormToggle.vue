<script setup lang="ts">
defineOptions({ name: 'KitFormToggle' });

const {
  titlePrefix = '',
  title = '',
  titleSuffix = '',
} = defineProps<{
  titlePrefix?: string;
  title?: string;
  titleSuffix?: string;
}>();
const model = defineModel<boolean>();
</script>

<template>
  <KitFormControl
    :title-prefix="titlePrefix"
    :title="title"
    :title-suffix="titleSuffix"
    type="toggle"
  >
    <input
      v-model="model"
      type="checkbox"
      class="toggle"
      name="toggle"
    >
  </KitFormControl>
</template>
