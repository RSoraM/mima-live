<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title }}</span>
    </div>
    <div class="flex flex-col gap-2">
      <div class="join" v-for="(m, i) in model">
        <input type="text" v-model="m.value" class="input input-bordered join-item w-full" />
        <button class="btn join-item" @click="del(i)">Delete</button>
      </div>
      <button class="btn btn-primary" @click="add">ADD</button>
    </div>
  </label>
</template>

<script setup lang="ts">
defineOptions({
  name: 'KitFormInput',
})
defineProps<{
  title: string
}>()
const model = defineModel<{ value: string }[]>()

const add = () => {
  if (!model.value) model.value = []
  model.value.push({ value: '' })
}
const del = (index: number) => {
  if (!model.value) return
  model.value.splice(index, 1)
}
</script>
