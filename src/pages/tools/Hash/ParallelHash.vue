<script setup lang="ts">
import { HEX, parallelhash128, parallelhash128XOF, parallelhash256, parallelhash256XOF, UTF8 } from 'mima-kit';

defineOptions({ name: 'ParallelHash' });

const t = ref(256);
const b = ref(1024);
const s = ref('');
const s_codec = ref(UTF8);
const variant = ref('ParallelHash-128');
const variant_options: SelectOption[] = [
  { label: 'ParallelHash-128', value: 'ParallelHash-128' },
  { label: 'ParallelHash-128 XOF', value: 'ParallelHash-128 XOF' },
  { label: 'ParallelHash-256', value: 'ParallelHash-256' },
  { label: 'ParallelHash-256 XOF', value: 'ParallelHash-256 XOF' },
];
const alg = computed(() => {
  switch (variant.value) {
    case 'ParallelHash-128':
      return parallelhash128;
    case 'ParallelHash-128 XOF':
      return parallelhash128XOF;
    case 'ParallelHash-256':
      return parallelhash256;
    case 'ParallelHash-256 XOF':
      return parallelhash256XOF;
    default:
      return undefined;
  }
});
const hash = ref<ReturnType<typeof parallelhash128>>();

const i = ref('mima-kit');
const i_codec = ref(UTF8);
const o = ref('');
const o_codec = ref(HEX);

watch(
  [i, alg, b, t, s],
  () => {
    if (!alg.value)
      return;
    const S = s_codec.value(s.value);
    hash.value = alg.value(b.value, t.value, S);
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
      ParallelHash
    </h1>
    <KitFormControl title="Variant">
      <KitBaseFormSelect v-model="variant" :options="variant_options" />
    </KitFormControl>
    <div class="flex gap-2">
      <KitFormInput
        v-model="t" type="number"
        title="Digest Size (bit)"
      />
      <KitFormInput
        v-model="b" type="number"
        title="Block size (bit)"
      />
    </div>
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
