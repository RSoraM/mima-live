<script setup lang="ts">
import { HEX, sha3_224, sha3_256, sha3_384, sha3_512, UTF8 } from 'mima-kit';

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

const i = ref('mima-kit');
const i_codec = ref(UTF8);
const o = ref('');
const o_codec = ref(HEX);

watch(
  [i, hash],
  catchNotifySync(() => {
    if (!hash.value)
      return;
    const I = i_codec.value(i.value);
    const res = hash.value(I);
    o.value = o_codec.value(res);
  }),
  {
    immediate: true,
  },
);
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      SHA-3
    </h1>
    <div class="flex gap-2">
      <KitFormControl title="Variant">
        <KitBaseFormSelect v-model="variant" :options="variant_options" />
      </KitFormControl>
    </div>
    <KitFormTextAreaWithCodec v-model:text="i" v-model:codec="i_codec" title="Input" />
    <KitFormTextAreaWithCodec v-model:text="o" v-model:codec="o_codec" title="Output" />

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

      <KitStat title="Digest Size (bytes)">
        {{ hash?.DIGEST_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ hash?.BLOCK_SIZE }}
      </KitStat>

      <KitStat title="Structure">
        Sponge & Keccak-p
      </KitStat>

      <KitStat title="Round">
        24
      </KitStat>
    </div>
  </div>
</template>
