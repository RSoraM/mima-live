<script setup lang="ts">
import type { Codec } from 'mima-kit';

defineOptions({ name: 'KitFormInputArray' });
defineProps<{ title: string }>();
const model = defineModel<{ value: string }[]>('array');
const codec = defineModel<Codec>('codec', { required: true });

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
watch(
  codec,
  (new_codec, old_codec) => {
    if (!model.value)
      return;
    model.value.forEach((m) => {
      m.value = new_codec(old_codec(m.value));
    });
  },
);
</script>

<template>
  <KitFormControl :title="title">
    <div class="join join-vertical flex flex-col">
      <KitBaseFormCodecSelect v-model="codec" class="join-item" />
      <div v-for="(m, i) in model" :key="i" class="join join-item join-horizontal">
        <input v-model="m.value" type="text" class="input join-item input-bordered w-full text-xs">
        <button class="btn btn-outline join-item" @click="del(i)">
          Delete
        </button>
      </div>
      <button class="btn btn-outline join-item" @click="add">
        ADD
      </button>
    </div>
  </KitFormControl>
</template>
