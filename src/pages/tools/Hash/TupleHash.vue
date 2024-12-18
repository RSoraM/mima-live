<script setup lang="ts">
import { HEX, tuplehash128, tuplehash128XOF, tuplehash256, tuplehash256XOF, UTF8 } from 'mima-kit';

defineOptions({ name: 'TupleHash' });

const t = ref(256);
const s = ref('');
const s_codec = ref(UTF8);
const variant = ref('TupleHash-128');
const variant_options: SelectOption[] = [
  { label: 'TupleHash-128', value: 'TupleHash-128' },
  { label: 'TupleHash-128 XOF', value: 'TupleHash-128 XOF' },
  { label: 'TupleHash-256', value: 'TupleHash-256' },
  { label: 'TupleHash-256 XOF', value: 'TupleHash-256 XOF' },
];
const alg = computed(() => {
  switch (variant.value) {
    case 'TupleHash-128':
      return tuplehash128;
    case 'TupleHash-128 XOF':
      return tuplehash128XOF;
    case 'TupleHash-256':
      return tuplehash256;
    case 'TupleHash-256 XOF':
      return tuplehash256XOF;
    default:
      return undefined;
  }
});
const hash = ref<ReturnType<typeof tuplehash128>>();

const i = ref([{ value: 'mima-kit' }]);
const i_codec = ref(UTF8);
const o = ref('');
const o_codec = ref(HEX);

watch(
  [i, alg, s],
  catchNotifySync(() => {
    if (!alg.value)
      return;
    const S = s_codec.value(s.value);
    hash.value = alg.value(t.value, S);
    const I = i.value.map(item => i_codec.value(item.value));
    const res = hash.value(I);
    o.value = o_codec.value(res);
  }),
  {
    immediate: true,
    deep: true,
  },
);
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      TupleHash
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
    <KitFormInputWithCodec v-model:text="s" v-model:codec="s_codec" title="Customization" />
    <KitFormInputArray v-model:array="i" v-model:codec="i_codec" title="Input" />
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
