<script setup lang="ts">
defineOptions({ name: 'KitFormU8Array' });

const { immediate = false } = defineProps<{
  title: string;
  immediate?: boolean;
}>();
const model = defineModel<{ value: InstanceType<typeof U8> }[]>();

function add() {
  if (!model.value)
    model.value = [];
  model.value.push({ value: new U8() });
}
function del(index: number) {
  if (!model.value)
    return;
  model.value.splice(index, 1);
}
</script>

<template>
  <KitFormControl :title="title">
    <div class="join join-vertical flex flex-col">
      <KitFormU8Base
        v-for="(m, i) in model" :key="i"
        v-model="m.value" :codec="UTF8"
        :immediate="immediate"
      >
        <button class="btn btn-outline join-item" @click="del(i)">
          Delete
        </button>
      </KitFormU8Base>
      <button class="btn btn-outline join-item" @click="add">
        ADD
      </button>
    </div>
  </KitFormControl>
</template>
