<script setup lang="ts">
import type { TupleHashConfig } from 'mima-kit';
import { B64, B64URL, HEX, tupleHash128, tupleHash128XOF, tupleHash256, tupleHash256XOF, UTF8 } from 'mima-kit';

defineOptions({ name: 'TupleHash' });

const variantOptions: SelectOption[] = [
  { label: 'TupleHash-128', value: 'TupleHash-128' },
  { label: 'TupleHash-128 XOF', value: 'TupleHash-128 XOF' },
  { label: 'TupleHash-256', value: 'TupleHash-256' },
  { label: 'TupleHash-256 XOF', value: 'TupleHash-256 XOF' },
];

const params = reactive({
  variants: 'TupleHash-128',
  S: '',
  SCodec: UTF8,
  t: '256',
  codec: UTF8,
  input: [{ value: '' }],
});
const hex = ref('');
const b64 = ref('');
const b64url = ref('');

const alg = computed(() => {
  const config: TupleHashConfig = {
    S: params.S,
    S_CODEC: params.SCodec,
    INPUT_CODEC: params.codec,
  };
  const t = Number(params.t);
  switch (params.variants) {
    case 'TupleHash-128':
      return tupleHash128(t, config);
    case 'TupleHash-128 XOF':
      return tupleHash128XOF(t, config);
    case 'TupleHash-256':
      return tupleHash256(t, config);
    case 'TupleHash-256 XOF':
      return tupleHash256XOF(t, config);
    default:
      return undefined;
  }
});

watchEffect(() => {
  if (!alg.value)
    return;
  const { codec, input } = params;
  const res = alg.value.digest(input.map(i => codec.parse(i.value)));
  hex.value = HEX.stringify(res);
  b64.value = B64.stringify(res);
  b64url.value = B64URL.stringify(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto my-8 text-4xl font-bold">
      TupleHash
    </h1>
    <div class="flex gap-2">
      <KitFormSelect v-model="params.variants" title="Variant" :options="variantOptions" />
      <KitFormInput v-model="params.t" title="output bits" />
    </div>
    <KitFormInputWithCodec v-model:text="params.S" v-model:codec="params.SCodec" title="customization" />
    <KitFormCodecSelect v-model="params.codec" title="Input Codec" />
    <!-- <KitFormTextArea title="Input" v-model="params.input" /> -->
    <KitFormInputArray v-model="params.input" title="Input Array" />
    <div class="divider">
      OUTPUT
    </div>
    <KitFormOutput v-model="hex" title="Hex" />
    <KitFormOutput v-model="b64" title="Base64" />
    <KitFormOutput v-model="b64url" title="Base64URL" />

    <div class="stats stats-vertical my-6 shadow">
      <div class="stat">
        <div class="stat-title">
          Specification
        </div>
        <div class="stat-value">
          <KitRefLink
            :texts="['NIST', 'SP.800-185']"
            icon="icon-[carbon--pdf-reference]"
            href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-185.pdf"
          />
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          First published
        </div>
        <div class="stat-value">
          2016
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Digest Size
        </div>
        <div class="stat-value">
          {{ alg?.DIGEST_SIZE }}-byte
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Block Size
        </div>
        <div class="stat-value">
          {{ alg?.BLOCK_SIZE }}-byte
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Structure
        </div>
        <div class="stat-value">
          Sponge
        </div>
        <div class="stat-value">
          with
        </div>
        <div class="stat-value">
          Keccak
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Round
        </div>
        <div class="stat-value">
          24
        </div>
      </div>
    </div>
  </div>
</template>
