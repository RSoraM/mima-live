<script setup lang="ts">
const buffer = ref(UTF8('mima-kit'));
</script>

<template>
  <h1 class="mx-auto text-4xl font-bold md:my-8">
    Text Codec
  </h1>
  <KitFormU8
    v-model="buffer"
    :codec="UTF8"
    :immediate="true"
    title="Input"
    textarea
  />
  <KitFormU8
    v-model="buffer"
    :codec="HEX"
    title="Output"
    textarea
  />
</template>
