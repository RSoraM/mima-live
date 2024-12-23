<script setup lang="ts">
defineOptions({ name: 'ParallelHash' });

const t = ref(256);
const b = ref(1024);
const S = ref(new U8());
const variant = ref('ParallelHash-128');
const variant_options: SelectOption[] = [
  { label: 'ParallelHash-128', value: 'ParallelHash-128' },
  { label: 'ParallelHash-128 XOF', value: 'ParallelHash-128 XOF' },
  { label: 'ParallelHash-256', value: 'ParallelHash-256' },
  { label: 'ParallelHash-256 XOF', value: 'ParallelHash-256 XOF' },
];
watchImmediate(variant, () => t.value = variant.value.startsWith('ParallelHash-128') ? 256 : 512);
const hash = computed(() => {
  switch (variant.value) {
    case 'ParallelHash-128':
      return parallelhash128(b.value, t.value, S.value);
    case 'ParallelHash-128 XOF':
      return parallelhash128XOF(b.value, t.value, S.value);
    case 'ParallelHash-256':
      return parallelhash256(b.value, t.value, S.value);
    case 'ParallelHash-256 XOF':
      return parallelhash256XOF(b.value, t.value, S.value);
    default:
      return undefined;
  }
});

const I = ref(UTF8('mima-kit'));
const O = ref(new U8());

watchEffect(catchNotifySync(() => {
  O.value = hash.value ? hash.value(I.value) : new U8();
}));
</script>

<template>
  <h1 class="mx-auto text-4xl font-bold md:my-8">
    ParallelHash
  </h1>
  <KitFormSelect
    v-model="variant"
    :options="variant_options"
    title="Variant"
  />
  <div class="flex gap-2">
    <KitFormNumber
      v-model="t"
      title="Digest Size (bit)"
    />
    <KitFormNumber
      v-model="b"
      title="Block size (bit)"
    />
  </div>
  <KitFormU8
    v-model="S" :codec="UTF8"
    :immediate="true"
    title="Customization"
  />
  <KitFormU8
    v-model="I" :codec="UTF8"
    :immediate="true"
    title="Input"
    textarea
  />
  <KitFormU8
    v-model="O"
    :codec="HEX"
    title="Output"
    textarea
  />

  <div class="stats stats-vertical my-6 shadow">
    <KitStat title="Specification">
      <KitRefLink
        :texts="['NIST', 'SP.800-185']"
        icon="icon-[carbon--pdf-reference]"
        href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-185.pdf"
      />
    </KitStat>

    <KitStat title="First published">
      2016
    </KitStat>

    <KitStat title="Digest Size (byte)">
      {{ hash?.DIGEST_SIZE }}
    </KitStat>

    <KitStat title="Block Size (byte)">
      {{ hash?.BLOCK_SIZE }}
    </KitStat>

    <KitStat title="Structure">
      Sponge & Keccak-p
    </KitStat>

    <KitStat title="Round">
      24
    </KitStat>
  </div>
</template>
