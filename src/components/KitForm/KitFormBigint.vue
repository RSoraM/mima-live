<script setup lang="ts">
defineOptions({ name: 'KitFormBigint' });

defineProps<{ title: string }>();
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
  <KitFormControl :title="title">
    <KitFormU8Base v-model="u8" :codec="HEX" />
  </KitFormControl>
</template>
