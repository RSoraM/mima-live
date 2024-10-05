<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title }}</span>
    </div>
    <select v-model="model" class="select select-bordered">
      <option v-for="option in options" :key="option.text" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
defineOptions({
  name: 'KitFormSelect',
})
defineProps<{
  title: string
  options: Record<string, any>[]
}>()
const model = defineModel()
</script>
