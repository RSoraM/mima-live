<script setup lang="ts">
import type { Codec } from 'mima-kit';
import { FpECC, HEX, secp256r1, U8 } from 'mima-kit';

defineOptions({ name: 'KitFormPointCompress' });
const { title = 'Point', fold = true } = defineProps<{ title?: string;fold?: boolean }>();

interface Point {
  isInfinity?: boolean;
  x: string;
  y: string;
}

// curve
const curve = defineModel<typeof secp256r1>('curve', { default: secp256r1 });
const ec = computed(() => FpECC(curve.value));

// point
const p_codec = defineModel<Codec>('codec', { default: HEX });
const p = defineModel<Point>('p', { default: {
  isInfinity: true,
  x: '',
  y: '',
} });
const p_raw = computed({
  get: () => ({
    isInfinity: p.value.isInfinity,
    x: p.value.x ? p_codec.value(p.value.x).toBI() : 0n,
    y: p.value.y ? p_codec.value(p.value.y).toBI() : 0n,
  }),
  set: (value) => {
    p.value = {
      isInfinity: value.isInfinity,
      x: value.x ? p_codec.value(U8.fromBI(value.x)) : '',
      y: value.y ? p_codec.value(U8.fromBI(value.y)) : '',
    };
  },
});

// compression
const compressed_p = ref('');
const compressed_p_codec = ref<Codec>(HEX);
const uncompressed_p = ref('');
const uncompressed_p_codec = ref<Codec>(HEX);
function convert() {
  const compressed = ec.value.PointToU8(p_raw.value, true);
  compressed_p.value = compressed_p_codec.value(compressed);
  const uncompressed = ec.value.PointToU8(p_raw.value);
  uncompressed_p.value = uncompressed_p_codec.value(uncompressed);
}
function recover() {
  if (compressed_p.value) {
    const u8 = compressed_p_codec.value(compressed_p.value);
    const P = ec.value.U8ToPoint(u8);
    p.value = {
      isInfinity: P.isInfinity,
      x: p_codec.value(U8.fromBI(P.x)),
      y: p_codec.value(U8.fromBI(P.y)),
    };
  }
  else if (uncompressed_p.value) {
    const u8 = uncompressed_p_codec.value(uncompressed_p.value);
    const P = ec.value.U8ToPoint(u8);
    p.value = {
      isInfinity: P.isInfinity,
      x: p_codec.value(U8.fromBI(P.x)),
      y: p_codec.value(U8.fromBI(P.y)),
    };
  }
}

convert();
</script>

<template>
  <div>
    <KitFormInputWithCodec v-model:codec="p_codec" v-model:text="p.x" :title="`${title}.x (${getBIBits(p_raw.x)} byte)`" />
    <KitFormInputWithCodec v-model:codec="p_codec" v-model:text="p.y" :title="`${title}.y (${getBIBits(p_raw.y)} byte)`" />
    <KitCollapse v-if="fold" class="my-2 bg-base-300">
      <template #header>
        Point Compression
      </template>
      <KitFormToggle v-model="p.isInfinity" :title="`${title}.isInfinity`" />
      <!-- Compression -->
      <div class="divider my-6">
        <button class="btn btn-outline btn-sm" @click="recover()">
          Recover
        </button>/
        <button class="btn btn-outline btn-sm" @click="convert()">
          Convert
        </button>
      </div>
      <KitFormInputWithCodec v-model:codec="compressed_p_codec" v-model:text="compressed_p" :title="`Compressed ${title}`" />
      <KitFormInputWithCodec v-model:codec="uncompressed_p_codec" v-model:text="uncompressed_p" :title="`Uncompressed ${title}`" />
    </KitCollapse>
    <div v-else>
      <KitFormToggle v-model="p.isInfinity" :title="`${title}.isInfinity`" />
      <!-- Compression -->
      <div class="divider my-6">
        <KitButton @click="recover()">
          Recover
        </KitButton>/
        <KitButton @click="convert()">
          Convert
        </KitButton>
      </div>
      <KitFormInputWithCodec v-model:codec="compressed_p_codec" v-model:text="compressed_p" :title="`Compressed ${title}`" />
      <KitFormInputWithCodec v-model:codec="uncompressed_p_codec" v-model:text="uncompressed_p" :title="`Uncompressed ${title}`" />
    </div>
  </div>
</template>
