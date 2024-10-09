<script setup lang="ts">
import { B64, B64URL, HEX, sha224, sha256, sha384, sha512, sha512t, UTF8 } from 'mima-kit';

defineOptions({ name: 'SHA2' });

const variantOptions: SelectOption[] = [
  { label: 'SHA-224', value: 'SHA-224' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
  { label: 'SHA-512/t', value: 'SHA-512/t' },
];

const params = reactive({
  variants: 'SHA-256',
  t: '224',
  codec: UTF8,
  input: '',
});
const hex = ref('');
const b64 = ref('');
const b64url = ref('');

const alg = computed(() => {
  switch (params.variants) {
    case 'SHA-224':
      return sha224;
    case 'SHA-256':
      return sha256;
    case 'SHA-384':
      return sha384;
    case 'SHA-512':
      return sha512;
    case 'SHA-512/t':
      return sha512t(Number(params.t));
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
      SHA-2
    </h1>
    <div class="flex gap-2">
      <KitFormSelect v-model="params.variants" title="Variant" :options="variantOptions" />
      <KitFormInput v-show="params.variants === 'SHA-512/t'" v-model="params.t" title="output bits" />
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
            :texts="['NIST', 'FIPS.180-4']"
            icon="icon-[carbon--pdf-reference]"
            href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf"
          />
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          First published
        </div>
        <div class="stat-value">
          2001
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
          Merkle-Damgård
        </div>
        <div class="stat-value">
          with
        </div>
        <div class="stat-value">
          Davies-Meyer
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">
          Round
        </div>
        <div class="stat-value">
          64 or 80
        </div>
      </div>
    </div>
  </div>
</template>
