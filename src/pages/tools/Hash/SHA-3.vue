<script setup lang="ts">
import { HEX, sha3_224, sha3_256, sha3_384, sha3_512, UTF8 } from 'mima-kit';

defineOptions({ name: 'SHA3' });

const variants = ref('SHA-3-256');
const variantOptions: SelectOption[] = [
  { label: 'SHA-3-224', value: 'SHA-3-224' },
  { label: 'SHA-3-256', value: 'SHA-3-256' },
  { label: 'SHA-3-384', value: 'SHA-3-384' },
  { label: 'SHA-3-512', value: 'SHA-3-512' },
];

const alg = computed(() => {
  switch (variants.value) {
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

watchEffect(() => {
  if (!alg.value)
    return;
  const I = i_codec.value.parse(i.value);
  const res = alg.value.digest(I);
  o.value = o_codec.value.stringify(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      SHA-3
    </h1>
    <div class="flex gap-2">
      <KitFormControl title="Variant">
        <KitBaseFormSelect v-model="variants" :options="variantOptions" />
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
        {{ alg?.DIGEST_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ alg?.BLOCK_SIZE }}
      </KitStat>

      <KitStat title="Structure">
        Sponge<br>
        with<br>
        Keccak
      </KitStat>

      <KitStat title="Round">
        24
      </KitStat>
    </div>
  </div>
</template>
