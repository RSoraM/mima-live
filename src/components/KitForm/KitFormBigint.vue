<script setup lang="ts">
import type { Codec } from 'mima-kit';
import { HEX, U8 } from 'mima-kit';
import KitFormControl from './KitFormControl.vue';

defineOptions({ name: 'KitFormBigint' });
defineProps<{ title: string }>();
const int = defineModel<bigint>({ required: true });
const codec = ref<Codec>(HEX);
const str = ref(U8.fromBI(int.value).to(codec.value));
onMounted(() => {
  watch(
    codec,
    (new_codec, old_codec) => {
      str.value = old_codec(str.value).to(new_codec);
    },
  );
  watch(
    int,
    () => {
      str.value = U8.fromBI(int.value).to(codec.value);
    },
    { immediate: true },
  );
  watch(
    str,
    () => {
      int.value = codec.value(str.value).toBI();
    },
    { immediate: true },
  );
});
</script>

<template>
  <KitFormControl :title="title">
    <div class="join">
      <KitBaseFormCodecSelect v-model="codec" class="join-item" />
      <input v-model="str" type="text" class="input join-item input-bordered w-full text-xs">
    </div>
  </KitFormControl>
</template>
