<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title }}</span>
    </div>
    <input type="text" v-model="model" class="input input-bordered" />
  </label>
</template>

<script setup lang="ts">
defineOptions({
  name: 'KitFormInput',
})
defineProps<{
  title: string
}>()
const model = defineModel<string>()
</script>
