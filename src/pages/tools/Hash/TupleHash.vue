<script setup lang="ts">
import type { TupleHashConfig } from 'mima-kit';
import { HEX, tupleHash128, tupleHash128XOF, tupleHash256, tupleHash256XOF, UTF8 } from 'mima-kit';

defineOptions({ name: 'TupleHash' });

const t = ref(256);
const variants = ref('TupleHash-128');
const variantOptions: SelectOption[] = [
  { label: 'TupleHash-128', value: 'TupleHash-128' },
  { label: 'TupleHash-128 XOF', value: 'TupleHash-128 XOF' },
  { label: 'TupleHash-256', value: 'TupleHash-256' },
  { label: 'TupleHash-256 XOF', value: 'TupleHash-256 XOF' },
];

const s = ref('');
const s_codec = ref(UTF8);

const alg = computed(() => {
  const config: TupleHashConfig = {
    S: s.value,
    S_CODEC: s_codec.value,
  };
  switch (variants.value) {
    case 'TupleHash-128':
      return tupleHash128(t.value, config);
    case 'TupleHash-128 XOF':
      return tupleHash128XOF(t.value, config);
    case 'TupleHash-256':
      return tupleHash256(t.value, config);
    case 'TupleHash-256 XOF':
      return tupleHash256XOF(t.value, config);
    default:
      return undefined;
  }
});

const i = ref([{ value: 'mima-kit' }]);
const i_codec = ref(UTF8);
const o = ref('');
const o_codec = ref(HEX);

watchEffect(() => {
  if (!alg.value)
    return;
  const I = i.value.map(i => i_codec.value.parse(i.value));
  const res = alg.value.digest(I);
  o.value = o_codec.value.stringify(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      TupleHash
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
    <KitFormInputWithCodec v-model:text="s" v-model:codec="s_codec" title="customization" />
    <KitFormInputArray v-model="i" title="Input" />
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
