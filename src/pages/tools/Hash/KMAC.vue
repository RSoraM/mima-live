<script setup lang="ts">
import type { KMACConfig } from 'mima-kit';
import { B64, B64URL, HEX, kmac128, kmac128XOF, kmac256, kmac256XOF, UTF8 } from 'mima-kit';

defineOptions({ name: 'KMAC' });

const variantOptions: SelectOption[] = [
  { label: 'KMAC-128', value: 'KMAC-128' },
  { label: 'KMAC-128 XOF', value: 'KMAC-128 XOF' },
  { label: 'KMAC-256', value: 'KMAC-256' },
  { label: 'KMAC-256 XOF', value: 'KMAC-256 XOF' },
];

const params = reactive({
  variants: 'KMAC-128',
  K: '',
  KCodec: UTF8,
  S: '',
  SCodec: UTF8,
  t: '256',
  codec: UTF8,
  input: '',
});
const hex = ref('');
const b64 = ref('');
const b64url = ref('');

const alg = computed(() => {
  const config: KMACConfig = {
    K: params.K,
    K_CODEC: params.KCodec,
    S: params.S,
    S_CODEC: params.SCodec,
    INPUT_CODEC: params.codec,
  };
  switch (params.variants) {
    case 'KMAC-128':
      return kmac128(Number(params.t), config);
    case 'KMAC-128 XOF':
      return kmac128XOF(Number(params.t), config);
    case 'KMAC-256':
      return kmac256(Number(params.t), config);
    case 'KMAC-256 XOF':
      return kmac256XOF(Number(params.t), config);
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
      KMAC
    </h1>
    <div class="flex gap-2">
      <KitFormSelect v-model="params.variants" title="Variant" :options="variantOptions" />
      <KitFormInput v-model="params.t" title="output bits" />
    </div>
    <KitFormInputWithCodec v-model:text="params.K" v-model:codec="params.KCodec" title="key" />
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
