<script setup lang="ts">
defineOptions({ name: 'KitFormInput' });
defineProps<{ title: string }>();
const model = defineModel<{ value: string }[]>();

function add() {
  if (!model.value)
    model.value = [];
  model.value.push({ value: '' });
}
function del(index: number) {
  if (!model.value)
    return;
  model.value.splice(index, 1);
}
</script>

<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title }}</span>
    </div>
    <div class="flex flex-col gap-2">
      <div v-for="(m, i) in model" :key="i" class="join">
        <input v-model="m.value" type="text" class="input join-item input-bordered w-full text-xs">
        <button class="btn join-item" @click="del(i)">Delete</button>
      </div>
      <button class="btn btn-primary" @click="add">ADD</button>
    </div>
  </label>
</template>
