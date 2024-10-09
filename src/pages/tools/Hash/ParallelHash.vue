<script setup lang="ts">
import type { ParallelHashConfig } from 'mima-kit';
import { B64, B64URL, HEX, parallelHash128, parallelHash128XOF, parallelHash256, parallelHash256XOF, UTF8 } from 'mima-kit';

defineOptions({ name: 'ParallelHash' });

const variantOptions: SelectOption[] = [
  { label: 'ParallelHash-128', value: 'ParallelHash-128' },
  { label: 'ParallelHash-128 XOF', value: 'ParallelHash-128 XOF' },
  { label: 'ParallelHash-256', value: 'ParallelHash-256' },
  { label: 'ParallelHash-256 XOF', value: 'ParallelHash-256 XOF' },
];

const params = reactive({
  variants: 'ParallelHash-128',
  S: '',
  SCodec: UTF8,
  b: '1024',
  t: '256',
  codec: UTF8,
  input: '',
});
const hex = ref('');
const b64 = ref('');
const b64url = ref('');

const alg = computed(() => {
  const config: ParallelHashConfig = {
    S: params.S,
    S_CODEC: params.SCodec,
    INPUT_CODEC: params.codec,
  };
  const b = Number(params.b);
  const t = Number(params.t);
  switch (params.variants) {
    case 'ParallelHash-128':
      return parallelHash128(b, t, config);
    case 'ParallelHash-128 XOF':
      return parallelHash128XOF(b, t, config);
    case 'ParallelHash-256':
      return parallelHash256(b, t, config);
    case 'ParallelHash-256 XOF':
      return parallelHash256XOF(b, t, config);
    default:
      return undefined;
  }
});

watchEffect(() => {
  if (!alg.value)
    return;
  const { codec, input } = params;
  const res = alg.value.digest(codec.parse(input));
  hex.value = HEX.stringify(res);
  b64.value = B64.stringify(res);
  b64url.value = B64URL.stringify(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto my-8 text-5xl font-bold">
      ParallelHash
    </h1>
    <KitFormSelect v-model="params.variants" title="Variant" :options="variantOptions" />
    <div class="flex gap-2">
      <KitFormInput v-model="params.b" title="block size" />
      <KitFormInput v-model="params.t" title="output bits" />
    </div>
    <KitFormInputWithCodec v-model:text="params.S" v-model:codec="params.SCodec" title="customization" />
    <KitFormCodecSelect v-model="params.codec" title="Input Codec" />
    <KitFormTextArea v-model="params.input" title="Input" />
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
