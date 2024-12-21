<script setup lang="ts">
import type { Codec, secp256r1 } from 'mima-kit';
import { FpECC, HEX } from 'mima-kit';

// props
defineOptions({ name: 'KitFormECKey' });
const { curve, title = '', fold = true } = defineProps<{
  curve: typeof secp256r1;
  title?: string;
  fold?: boolean;
}>();

const ec = computed(() => FpECC(curve));

// key
const key = defineModel<ReturnType<typeof ec['value']['genKey']>>({ required: true });

// compression
const compressed_p = ref('');
const compressed_p_codec = ref<Codec>(HEX);
const uncompressed_p = ref('');
const uncompressed_p_codec = ref<Codec>(HEX);

// functions
function genKey() {
  key.value = ec.value.genKey();
}
function clearKey() {
  key.value = {
    d: 0n,
    Q: {
      isInfinity: true,
      x: 0n,
      y: 0n,
    },
  };
  compressed_p.value = '';
  uncompressed_p.value = '';
}
function convert() {
  const P = key.value.Q;
  const compressed = ec.value.PointToU8(P, true);
  compressed_p.value = compressed_p_codec.value(compressed);
  const uncompressed = ec.value.PointToU8(P);
  uncompressed_p.value = uncompressed_p_codec.value(uncompressed);
}
function recover() {
  let buffer: Uint8Array;
  if (compressed_p.value) {
    buffer = compressed_p_codec.value(compressed_p.value);
  }
  else {
    buffer = uncompressed_p_codec.value(uncompressed_p.value);
  }
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

// watchers
watch(
  () => curve,
  () => clearKey(),
);
genKey();
nextTick(() => convert());
</script>

<template>
  <div>
    <div class="divider my-8" :class="title ? 'divider-start' : ''">
      {{ title ? `# Key ${title}:` : '' }}
      <KitButton @click="clearKey">
        Clear
      </KitButton>/
      <KitButton @click="genKey">
        Generate
      </KitButton>
    </div>
    <KitFormBigint
      v-model="key.d"
      :title="`Private Key d${title} (${getBIBits(key.d)} byte)`"
    />
    <KitFormBigint
      v-model="key.Q.x"
      :title="`Public Key Q${title}.x (${getBIBits(key.Q.x)} byte)`"
    />
    <KitFormBigint
      v-model="key.Q.y"
      :title="`Public Key Q${title}.y (${getBIBits(key.Q.y)} byte)`"
    />
    <KitCollapse v-if="fold" class="my-2 bg-base-300">
      <template #header>
        Point Compression
      </template>
      <KitFormToggle v-model="key.Q.isInfinity" :title="`Public Key Q${title}.isInfinity`" />
      <!-- Compression -->
      <div class="divider my-6">
        <KitButton @click="recover()">
          Recover
        </KitButton>/
        <KitButton @click="convert()">
          Convert
        </KitButton>
      </div>
      <KitFormInputWithCodec
        v-model:codec="compressed_p_codec"
        v-model:text="compressed_p"
        :title="`Compressed Q${title}`"
      />
      <KitFormInputWithCodec
        v-model:codec="uncompressed_p_codec"
        v-model:text="uncompressed_p"
        :title="`Uncompressed Q${title}`"
      />
    </KitCollapse>
    <div v-else>
      <KitFormToggle v-model="key.Q.isInfinity" :title="`Public Key Q${title}.isInfinity`" />
      <!-- Compression -->
      <div class="divider my-6">
        <KitButton @click="recover()">
          Recover
        </KitButton>/
        <KitButton @click="convert()">
          Convert
        </KitButton>
      </div>
      <KitFormInputWithCodec
        v-model:codec="compressed_p_codec"
        v-model:text="compressed_p"
        :title="`Compressed Q${title}`"
      />
      <KitFormInputWithCodec
        v-model:codec="uncompressed_p_codec"
        v-model:text="uncompressed_p"
        :title="`Uncompressed Q${title}`"
      />
    </div>
  </div>
</template>
