<script setup lang="ts">
defineOptions({ name: 'KitRefLink' });
defineProps<{
  texts?: string[];
  icon?: string;
  href?: string;
}>();
</script>

<template>
  <a
    :href="href" target="_blank"
    class="flex flex-col hover:text-primary"
  >
    <span
      v-for="(t, i) in texts" :key="i"
      class="flex items-center gap-2"
    >
      {{ t }}
      <span
        v-if="i === texts!.length - 1 "
        :class="icon || 'icon-[carbon--arrow-up-right]'"
      />
    </span>
  </a>
</template>
