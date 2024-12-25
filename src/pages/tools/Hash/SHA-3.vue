<script setup lang="ts">
defineOptions({ name: 'SHA3' });

const variant = ref('SHA-3-256');
const variant_options: SelectOption[] = [
  { label: 'SHA-3-224', value: 'SHA-3-224' },
  { label: 'SHA-3-256', value: 'SHA-3-256' },
  { label: 'SHA-3-384', value: 'SHA-3-384' },
  { label: 'SHA-3-512', value: 'SHA-3-512' },
];
const hash = computed(() => {
  switch (variant.value) {
    case 'SHA-3-224':
      return sha3_224;
    case 'SHA-3-256':
      return sha3_256;
    case 'SHA-3-384':
      return sha3_384;
    case 'SHA-3-512':
      return sha3_512;
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
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    SHA-3
  </h1>
  <KitFormSelect
    v-model="variant"
    :options="variant_options"
    title="Variant"
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
        :texts="['NIST', 'FIPS.202']"
        icon="icon-[carbon--pdf-reference]"
        href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf"
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
