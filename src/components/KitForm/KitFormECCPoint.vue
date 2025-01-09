<script setup lang="ts">
import { U8 } from 'mima-kit';

defineOptions({ name: 'KitFormECCPoint' });

const { curve } = defineProps<{
  curve: typeof secp256r1 | typeof curve25519;
  name?: string;
  xBit?: number;
  yBit?: number;
}>();
const ec = computed(() => FpECC(curve));
const point = defineModel<FpECPoint<U8>>({ required: true });

// compression
const compressed_p = ref(new U8());
const uncompressed_p = ref(new U8());

function convert() {
  const P = point.value;
  compressed_p.value = ec.value.utils.PointToU8(P, true);
  uncompressed_p.value = ec.value.utils.PointToU8(P);
}
function recover() {
  const buffer = uncompressed_p.value.length
    ? uncompressed_p.value
    : compressed_p.value;
  const P = ec.value.utils.U8ToPoint(buffer);
  point.value = P;
}

onMounted(() => nextTick(() => convert()));
</script>

<template>
  <KitFormU8
    v-model="point.x" :codec="HEX"
    :title="`${name}.x (${xBit ?? getBIBits(point.x.toBI())} bit)`"
  />
  <KitFormU8
    v-model="point.y" :codec="HEX"
    :title="`${name}.y (${yBit ?? getBIBits(point.y.toBI())} bit)`"
  />
  <KitFoldCard class="my-2 bg-base-200">
    <template #header>
      {{ name }} Compression
    </template>
    <KitFormToggle v-model="point.isInfinity" :title="`${name}.isInfinity`" />
    <KitFormU8
      v-model="compressed_p" :codec="HEX"
      :title="`Compressed ${name} (${compressed_p.length} byte)`"
    />
    <KitFormU8
      v-model="uncompressed_p" :codec="HEX"
      :title="`Uncompressed ${name} (${uncompressed_p.length} byte)`"
    />
    <template #action>
      <KitButton @click="recover()">
        Recover
      </KitButton>
      <KitButton @click="convert()">
        Convert
      </KitButton>
    </template>
  </KitFoldCard>
</template>
