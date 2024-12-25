<script setup lang="ts">
defineOptions({ name: 'KitFormECKey' });

// props
const {
  curve,
  name = '',
  fold = true,
  pointOnly: point_only = false,
} = defineProps<{
  curve: typeof secp256r1;
  name?: string;
  fold?: boolean;
  pointOnly?: boolean;
}>();

const ec = computed(() => FpECC(curve));

// key
const key = defineModel<{
  d: bigint;
  Q: {
    isInfinity: boolean;
    x: bigint;
    y: bigint;
  };
}>({ required: true });

// functions
function genKey() {
  const k = ec.value.genKey();
  key.value = {
    d: k.d,
    Q: {
      isInfinity: k.Q.isInfinity || false,
      x: k.Q.x,
      y: k.Q.y,
    },
  };
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
}

// watchers
watch(
  () => curve,
  () => clearKey(),
);

onMounted(() => nextTick(() => genKey()));
</script>

<template>
  <template v-if="!point_only">
    <KitDivider :class="{ 'divider-start': name }">
      {{ name ? `# Key ${name}:` : '' }}
      <KitButton @click="clearKey">
        Clear
      </KitButton>/
      <KitButton @click="genKey">
        Generate
      </KitButton>
    </KitDivider>
    <KitFormBigint
      v-model="key.d"
      :title="`Private Key d${name} (${getBIBits(key.d)} bit)`"
    />
  </template>
  <KitFormBigint
    v-model="key.Q.x"
    :title="`Public Key Q${name}.x (${getBIBits(key.Q.x)} bit)`"
  />
  <KitFormBigint
    v-model="key.Q.y"
    :title="`Public Key Q${name}.y (${getBIBits(key.Q.y)} bit)`"
  />
  <KitCollapse
    v-if="fold"
    class="my-2 bg-base-300"
  >
    <template #header>
      Point Compression
    </template>
    <KitFormECPointCompress v-model="key" :curve="curve" :title="name" />
  </KitCollapse>
  <KitFormECPointCompress
    v-else
    v-model="key"
    :curve="curve"
    :title="name"
  />
</template>
