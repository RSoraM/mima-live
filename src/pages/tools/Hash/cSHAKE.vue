<script setup lang="ts">
import { cshake128, cshake256, HEX, UTF8 } from 'mima-kit';

defineOptions({ name: 'CSHAKE' });

const t = ref(256);
const variants = ref('cSHAKE-128');
const variantOptions: SelectOption[] = [
  { label: 'cSHAKE-128', value: 'cSHAKE-128' },
  { label: 'cSHAKE-256', value: 'cSHAKE-256' },
];

const n = ref('');
const n_codec = ref(UTF8);
const s = ref('');
const s_codec = ref(UTF8);
const alg = computed(() => {
  const N = n_codec.value(n.value);
  const S = s_codec.value(s.value);
  switch (variants.value) {
    case 'cSHAKE-128':
      return cshake128(t.value, N, S);
    case 'cSHAKE-256':
      return cshake256(t.value, N, S);
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
      cSHAKE
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
    <KitFormInputWithCodec v-model:text="n" v-model:codec="n_codec" title="function-name" />
    <KitFormInputWithCodec v-model:text="s" v-model:codec="s_codec" title="customization" />
    <KitFormTextAreaWithCodec v-model:text="i" v-model:codec="i_codec" title="Input" />
    <KitFormTextAreaWithCodec v-model:text="o" v-model:codec="o_codec" title="Output" />

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
