<script setup lang="ts">
defineOptions({ name: 'KitFormControl' });
const { type = 'text' } = defineProps<{
  title?: string;
  type?: 'text' | 'toggle';
}>();

/**
 * This component is a wrapper for form controls.
 * if the title prop is provided, it will render a label with the title.
 * else, it will render the slot.
 */
</script>

<template>
  <template v-if="title">
    <label v-if="type === 'text'" class="form-control w-full">
      <div class="label">
        <span class="label-text text-xs">{{ title }}</span>
      </div>
      <slot />
    </label>
    <div v-else class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text text-xs">{{ title }}</span>
        <slot />
      </label>
    </div>
  </template>
  <slot v-else />
</template>
