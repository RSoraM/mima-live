<script setup lang="ts">
import { cshake128, cshake256, HEX, UTF8 } from 'mima-kit';

defineOptions({ name: 'CSHAKE' });

const t = ref(256);
const n = ref('');
const n_codec = ref(UTF8);
const s = ref('');
const s_codec = ref(UTF8);
const variant = ref('cSHAKE-128');
const variant_options: SelectOption[] = [
  { label: 'cSHAKE-128', value: 'cSHAKE-128' },
  { label: 'cSHAKE-256', value: 'cSHAKE-256' },
];
const alg = computed(() => {
  switch (variant.value) {
    case 'cSHAKE-128':
      return cshake128;
    case 'cSHAKE-256':
      return cshake256;
    default:
      return undefined;
  }
});
const hash = ref<ReturnType<typeof cshake128>>();

const i = ref('mima-kit');
const i_codec = ref(UTF8);
const o = ref('');
const o_codec = ref(HEX);

watch(
  [i, alg, n, s],
  () => {
    if (!alg.value)
      return;
    const N = n_codec.value(n.value);
    const S = s_codec.value(s.value);
    hash.value = alg.value(t.value, N, S);
    const I = i_codec.value(i.value);
    const res = hash.value(I);
    o.value = o_codec.value(res);
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      cSHAKE
    </h1>
    <div class="flex gap-2">
      <KitFormControl title="Variant">
        <KitBaseFormSelect v-model="variant" :options="variant_options" />
      </KitFormControl>
      <KitFormInput
        v-model="t" type="number"
        title="Digest Size (bit)"
      />
    </div>
    <KitFormInputWithCodec v-model:text="n" v-model:codec="n_codec" title="Function-Name" />
    <KitFormInputWithCodec v-model:text="s" v-model:codec="s_codec" title="Customization" />
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
