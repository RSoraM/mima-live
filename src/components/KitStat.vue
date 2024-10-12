<script setup lang="ts">
defineOptions({ name: 'KitStat' });

defineProps<{ title?: string }>();
</script>

<template>
  <div class="stat">
    <div class="stat-title">
      {{ title }}
    </div>
    <div class="stat-value text-2xl">
      <slot />
    </div>
  </div>
</template>
