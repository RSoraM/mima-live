<script setup lang="ts">
defineOptions({ name: 'KitButton' });
</script>

<template>
  <button class="btn btn-outline btn-sm">
    <slot />
  </button>
</template>
