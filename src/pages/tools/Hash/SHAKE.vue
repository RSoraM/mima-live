<script setup lang="ts">
import { HEX, shake128, shake256, UTF8 } from 'mima-kit';

defineOptions({ name: 'SHAKE' });

const t = ref(256);
const variants = ref('SHAKE-128');
const variantOptions: SelectOption[] = [
  { label: 'SHAKE-128', value: 'SHAKE-128' },
  { label: 'SHAKE-256', value: 'SHAKE-256' },
];

const alg = computed(() => {
  switch (variants.value) {
    case 'SHAKE-128':
      return shake128(t.value);
    case 'SHAKE-256':
      return shake256(t.value);
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
  const I = i_codec.value(i.value);
  const res = alg.value(I);
  o.value = o_codec.value(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      SHAKE
    </h1>
    <div class="flex gap-2">
      <KitFormControl title="Variant">
        <KitBaseFormSelect v-model="variants" :options="variantOptions" />
      </KitFormControl>
      <KitFormInput
        v-model="t" type="number"
        title="output (bits)"
      />
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
