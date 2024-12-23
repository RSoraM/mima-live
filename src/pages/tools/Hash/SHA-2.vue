<script setup lang="ts">
defineOptions({ name: 'SHA2' });

const t = ref(224);
const variant = ref('SHA-256');
const variant_options: SelectOption[] = [
  { label: 'SHA-224', value: 'SHA-224' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
  { label: 'SHA-512/t', value: 'SHA-512/t' },
];
const hash = computed(catchNotifySync(() => {
  switch (variant.value) {
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

const I = ref(UTF8('mima-kit'));
const O = ref(new U8());

watchEffect(catchNotifySync(() => {
  O.value = hash.value ? hash.value(I.value) : new U8();
}));
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      SHA-2
    </h1>
    <div class="flex gap-2">
      <KitFormControl title="Variant">
        <KitFormSelect v-model="variant" :options="variant_options" />
      </KitFormControl>
      <KitFormNumber
        v-show="variant === 'SHA-512/t'"
        v-model="t"
        title="Digest Size (bit)"
      />
    </div>
    <KitFormU8
      v-model="I" :codec="UTF8"
      :immediate="true"
      title="Input"
      textarea
    />
    <KitFormU8
      v-model="O"
      :codec="HEX"
      title="Output"
      textarea
    />

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

      <KitStat title="Digest Size (byte)">
        {{ hash?.DIGEST_SIZE }}
      </KitStat>

      <KitStat title="Block Size (byte)">
        {{ hash?.BLOCK_SIZE }}
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
