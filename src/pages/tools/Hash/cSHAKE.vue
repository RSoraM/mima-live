<script setup lang="ts">
import type { cSHAKEConfig } from 'mima-kit';
import { cShake128, cShake256, HEX, UTF8 } from 'mima-kit';

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
  const config: cSHAKEConfig = {
    N: n.value,
    N_CODEC: n_codec.value,
    S: s.value,
    S_CODEC: s_codec.value,
  };
  switch (variants.value) {
    case 'cSHAKE-128':
      return cShake128(t.value, config);
    case 'cSHAKE-256':
      return cShake256(t.value, config);
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
