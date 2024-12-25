<script setup lang="ts">
defineOptions({ name: 'KitFormModeConfig' });

const { blockCipher: block_cipher } = defineProps<{ blockCipher: typeof sm4 }>();

type Mode = typeof ecb | typeof cbc | typeof gcm;
const mode = ref<Mode>(cbc);
const padding = ref(PKCS7_PAD);
const t_size = ref(16);

const cipher = defineModel<ReturnType<Mode>>({ required: true });
watchEffect(() => {
  cipher.value = mode.value(block_cipher, padding.value, t_size.value);
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 md:gap-2">
    <KitFormSelectMode
      v-model="mode"
      :blocksize="block_cipher.BLOCK_SIZE"
      title="Mode"
    />
    <KitFormSelectPadding
      v-model="padding"
      :mode="mode"
      title="Padding"
    />
    <KitFormNumber
      v-if="mode === gcm"
      v-model="t_size"
      :max="16"
      class="md:col-span-2"
      title="GCM Tag Size (max: 16 bytes)"
    />
  </div>
</template>
