<script setup lang="ts">
import { B64, B64URL, HEX, shake128, shake256, UTF8 } from 'mima-kit';

defineOptions({ name: 'SHAKE' });

const variantOptions: SelectOption[] = [
  { label: 'SHAKE-128', value: 'SHAKE-128' },
  { label: 'SHAKE-256', value: 'SHAKE-256' },
];

const params = reactive({
  variants: 'SHAKE-128',
  t: '256',
  codec: UTF8,
  input: '',
});
const hex = ref('');
const b64 = ref('');
const b64url = ref('');

const alg = computed(() => {
  switch (params.variants) {
    case 'SHAKE-128':
      return shake128(Number(params.t));
    case 'SHAKE-256':
      return shake256(Number(params.t));
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
      SHAKE
    </h1>
    <div class="flex gap-2">
      <KitFormSelect v-model="params.variants" title="Variant" :options="variantOptions" />
      <KitFormInput v-model="params.t" title="output bits" />
    </div>
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
            :texts="['NIST', 'FIPS.202']"
            icon="icon-[carbon--pdf-reference]"
            href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf"
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
