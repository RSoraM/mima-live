<script setup lang="ts">
import { HEX, kmac128, kmac128XOF, kmac256, kmac256XOF, UTF8 } from 'mima-kit';

defineOptions({ name: 'KMAC' });

const t = ref(256);
const variants = ref('KMAC-128');
const variantOptions: SelectOption[] = [
  { label: 'KMAC-128', value: 'KMAC-128' },
  { label: 'KMAC-128 XOF', value: 'KMAC-128 XOF' },
  { label: 'KMAC-256', value: 'KMAC-256' },
  { label: 'KMAC-256 XOF', value: 'KMAC-256 XOF' },
];

const k = ref('');
const k_codec = ref(UTF8);
const s = ref('');
const s_codec = ref(UTF8);

const alg = computed(() => {
  const S = s_codec.value(s.value);
  switch (variants.value) {
    case 'KMAC-128':
      return kmac128(t.value, S);
    case 'KMAC-128 XOF':
      return kmac128XOF(t.value, S);
    case 'KMAC-256':
      return kmac256(t.value, S);
    case 'KMAC-256 XOF':
      return kmac256XOF(t.value, S);
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
  const K = k_codec.value(k.value);
  const I = i_codec.value(i.value);
  const res = alg.value(K, I);
  o.value = o_codec.value(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      KMAC
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
    <KitFormInputWithCodec v-model:text="k" v-model:codec="k_codec" title="Key" />
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
