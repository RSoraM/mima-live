<script setup lang="ts">
defineOptions({ name: 'KitFormOutput' });
defineProps<{ title?: string }>();
const cipher = defineModel('cipher');
const mac = defineModel('mac');
</script>

<template>
  <div class="divider">
    {{ title }}
  </div>
  <KitFormOutput v-model="cipher" :title="mac ? 'Cipher' : ''" />
  <KitFormOutput v-show="mac" v-model="mac" title="Mac" />
</template>
