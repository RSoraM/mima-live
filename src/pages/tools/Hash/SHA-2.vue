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
  <ToolsLayout title="SHA-2">
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-2">
        <KitFormSelect
          v-model="variant"
          :class="{ 'md:col-span-2': variant !== 'SHA-512/t' }" title="Variant" :options="variant_options"
        />
        <template v-if="variant === 'SHA-512/t'">
          <KitFormNumber v-model="t" title="Digest Size (bit)" />
        </template>
      </div>
      <KitFormU8 v-model="I" title="Input" :immediate="true" textarea :codec="UTF8" />
      <KitFormU8 v-model="O" title="Output" textarea :codec="HEX" />
    </template>
    <template #stat>
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
    </template>
  </ToolsLayout>
</template>
