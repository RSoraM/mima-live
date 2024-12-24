<script setup lang="ts">
defineOptions({ name: 'KitFormU8Array' });

const { immediate = false } = defineProps<{
  title?: string;
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
    <div class="mb-2 flex flex-col gap-2">
      <KitFormU8
        v-for="(m, i) in model" :key="i"
        v-model="m.value" :codec="UTF8"
        :immediate="immediate"
      >
        <button class="btn btn-outline join-item input-bordered" @click="del(i)">
          DELETE
        </button>
      </KitFormU8>
    </div>
  </KitFormControl>
  <button class="btn btn-outline" @click="add">
    ADD
  </button>
</template>
