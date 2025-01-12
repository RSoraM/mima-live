<script setup lang="ts">
defineOptions({ name: 'ToolsLayout' });
const {
  titlePrefix = '',
  title = '',
  titleSuffix = '',
} = defineProps<{
  titlePrefix?: string;
  title?: string;
  titleSuffix?: string;
}>();
</script>

<template>
  <slot name="title">
    <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
      {{ titlePrefix + title + titleSuffix }}
    </h1>
  </slot>

  <slot name="body" />

  <div v-if="$slots.default" class="flex flex-col gap-4">
    <slot />
  </div>

  <div v-if="$slots.stat" class="stats stats-vertical my-6 shadow">
    <slot name="stat" />
  </div>

  <slot name="footer" />
</template>
