<script setup lang="ts">
import { HEX, parallelhash128, parallelhash128XOF, parallelhash256, parallelhash256XOF, UTF8 } from 'mima-kit';

defineOptions({ name: 'ParallelHash' });

const t = ref(256);
const b = ref(1024);
const variants = ref('ParallelHash-128');
const variantOptions: SelectOption[] = [
  { label: 'ParallelHash-128', value: 'ParallelHash-128' },
  { label: 'ParallelHash-128 XOF', value: 'ParallelHash-128 XOF' },
  { label: 'ParallelHash-256', value: 'ParallelHash-256' },
  { label: 'ParallelHash-256 XOF', value: 'ParallelHash-256 XOF' },
];

const s = ref('');
const s_codec = ref(UTF8);

const alg = computed(() => {
  const S = s_codec.value(s.value);
  switch (variants.value) {
    case 'ParallelHash-128':
      return parallelhash128(b.value, t.value, S);
    case 'ParallelHash-128 XOF':
      return parallelhash128XOF(b.value, t.value, S);
    case 'ParallelHash-256':
      return parallelhash256(b.value, t.value, S);
    case 'ParallelHash-256 XOF':
      return parallelhash256XOF(b.value, t.value, S);
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
      ParallelHash
    </h1>
    <KitFormControl title="Variant">
      <KitBaseFormSelect v-model="variants" :options="variantOptions" />
    </KitFormControl>
    <div class="flex gap-2">
      <KitFormInput
        v-model="t" type="number"
        title="output (bits)"
      />
      <KitFormInput
        v-model="b" type="number"
        title="block size (bits)"
      />
    </div>
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
