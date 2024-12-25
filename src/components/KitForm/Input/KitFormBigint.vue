<script setup lang="ts">
defineOptions({ name: 'KitFormBigint' });

const { title } = defineProps<{ title?: string }>();
const bi = defineModel<bigint>({ required: true });
const u8 = ref(new U8());

onMounted(() => {
  watchImmediate(
    bi,
    () => u8.value = U8.fromBI(bi.value),
  );
  watchImmediate(
    u8,
    () => bi.value = u8.value.toBI(),
  );
});
</script>

<template>
  <KitFormU8 v-model="u8" :title="title" :codec="HEX" />
</template>
