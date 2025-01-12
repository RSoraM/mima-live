<script setup lang="ts">
defineOptions({ name: 'KitStat' });
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
  <div class="stat">
    <div class="stat-title">
      {{ titlePrefix + title + titleSuffix }}
    </div>
    <div class="stat-value text-2xl">
      <slot />
    </div>
  </div>
</template>
