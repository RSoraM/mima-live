<script setup lang="ts">
defineOptions({ name: 'KitFormECPointCompress' });

const { curve } = defineProps<{
  curve: typeof secp256r1;
  title?: string;
}>();
const ec = computed(() => FpECC(curve));
const key = defineModel<{
  d: bigint;
  Q: {
    isInfinity: boolean;
    x: bigint;
    y: bigint;
  };
}>({ required: true });

// compression
const compressed_p = ref(new U8());
const uncompressed_p = ref(new U8());

function convert() {
  const P = key.value.Q;
  compressed_p.value = ec.value.PointToU8(P, true);
  uncompressed_p.value = ec.value.PointToU8(P);
}
function recover() {
  const buffer = compressed_p.value.length
    ? compressed_p.value
    : uncompressed_p.value;
  const P = ec.value.U8ToPoint(buffer);
  key.value = {
    d: key.value.d,
    Q: {
      isInfinity: P.isInfinity || false,
      x: P.x,
      y: P.y,
    },
  };
}

onMounted(() => nextTick(() => convert()));
</script>

<template>
  <KitFormToggle v-model="key.Q.isInfinity" :title="`Public Key Q${title}.isInfinity`" />
  <!-- Compression -->
  <KitDivider>
    <KitButton @click="recover()">
      Recover
    </KitButton>/
    <KitButton @click="convert()">
      Convert
    </KitButton>
  </KitDivider>
  <KitFormU8
    v-model="compressed_p"
    :codec="HEX"
    :title="`Compressed Q${title} (${compressed_p.length << 3} bit)`"
  />
  <KitFormU8
    v-model="uncompressed_p"
    :codec="HEX"
    :title="`Uncompressed Q${title} (${uncompressed_p.length << 3} bit)`"
  />
</template>
