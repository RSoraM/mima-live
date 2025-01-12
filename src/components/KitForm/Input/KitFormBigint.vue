<script setup lang="ts">
defineOptions({ name: 'KitFormBigint' });

const {
  titlePrefix = '',
  title = '',
  titleSuffix = '',
} = defineProps<{
  titlePrefix?: string;
  title?: string;
  titleSuffix?: string;
}>();
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
  <KitFormU8
    v-model="u8" :codec="HEX"
    :title-prefix="titlePrefix"
    :title="title"
    :title-suffix="titleSuffix"
  />
</template>
