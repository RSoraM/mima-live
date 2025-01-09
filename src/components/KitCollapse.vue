<script setup lang="ts">
defineOptions({ name: 'KitCollapse' });
</script>

<template>
  <details class="collapse collapse-plus">
    <summary class="collapse-title min-h-0 text-sm font-bold">
      <slot name="header" />
    </summary>
    <div class="collapse-content">
      <slot />
      <div v-if="$slots.action" class="mt-4 flex justify-end gap-4">
        <slot name="action" />
      </div>
    </div>
  </details>
</template>
