<script setup lang="ts">
import { HEX, sha224, sha256, sha384, sha512, sha512t, UTF8 } from 'mima-kit';

defineOptions({ name: 'SHA2' });

const t = ref(224);
const variants = ref('SHA-256');
const variantOptions: SelectOption[] = [
  { label: 'SHA-224', value: 'SHA-224' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
  { label: 'SHA-512/t', value: 'SHA-512/t' },
];

const alg = computed(catchNotifySync(() => {
  switch (variants.value) {
    case 'SHA-224':
      return sha224;
    case 'SHA-256':
      return sha256;
    case 'SHA-384':
      return sha384;
    case 'SHA-512':
      return sha512;
    case 'SHA-512/t':
      return sha512t(t.value);
    default:
      return undefined;
  }
}));

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
      SHA-2
    </h1>
    <div class="flex gap-2">
      <KitFormControl title="Variant">
        <KitBaseFormSelect v-model="variants" :options="variantOptions" />
      </KitFormControl>
      <KitFormInput
        v-show="variants === 'SHA-512/t'"
        v-model="t" type="number"
        title="output (bits)"
      />
    </div>
    <KitFormTextAreaWithCodec v-model:text="i" v-model:codec="i_codec" title="Input" />
    <KitFormTextAreaWithCodec v-model:text="o" v-model:codec="o_codec" title="Output" />

    <div class="stats stats-vertical my-6 shadow">
      <KitStat title="Specification">
        <KitRefLink
          :texts="['NIST', 'FIPS.180-4']"
          icon="icon-[carbon--pdf-reference]"
          href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf"
        />
      </KitStat>

      <KitStat title="First published">
        2001
      </KitStat>

      <KitStat title="Digest Size (bytes)">
        {{ alg?.DIGEST_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ alg?.BLOCK_SIZE }}
      </KitStat>

      <KitStat title="Structure">
        Merkle-Damgård<br>
        with<br>
        Davies-Meyer
      </KitStat>

      <KitStat title="Round">
        64 or 80
      </KitStat>
    </div>
  </div>
</template>
