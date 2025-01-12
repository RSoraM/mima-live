<script setup lang="ts">
defineOptions({ name: 'SHAKE' });

const t = ref(256);
const variant = ref('SHAKE-128');
const variant_options: SelectOption[] = [
  { label: 'SHAKE-128', value: 'SHAKE-128' },
  { label: 'SHAKE-256', value: 'SHAKE-256' },
];
watchImmediate(variant, () => t.value = variant.value === 'SHAKE-128' ? 256 : 512);
const hash = computed(() => {
  switch (variant.value) {
    case 'SHAKE-128':
      return shake128(t.value);
    case 'SHAKE-256':
      return shake256(t.value);
    default:
      return undefined;
  }
});

const I = ref(UTF8('mima-kit'));
const O = ref(new U8());

watchEffect(catchNotifySync(() => {
  O.value = hash.value ? hash.value(I.value) : new U8();
}));
</script>

<template>
  <ToolsLayout title="SHAKE">
    <template #body>
      <div class="flex flex-col md:flex-row md:gap-2">
        <KitFormSelect v-model="variant" title="Variant" :options="variant_options" />
        <KitFormNumber v-model="t" title="Digest Size (bit)" />
      </div>
      <KitFormU8 v-model="I" title="Input" :immediate="true" textarea :codec="UTF8" />
      <KitFormU8 v-model="O" title="Output" textarea :codec="HEX" />
    </template>
    <template #stat>
      <KitStat title="Specification">
        <KitRefLink
          :texts="['NIST', 'FIPS.202']"
          icon="icon-[carbon--pdf-reference]"
          href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf"
        />
      </KitStat>
      <KitStat title="First published">
        2016
      </KitStat>
      <KitStat title="Digest Size (byte)">
        {{ hash?.DIGEST_SIZE }}
      </KitStat>
      <KitStat title="Block Size (byte)">
        {{ hash?.BLOCK_SIZE }}
      </KitStat>
      <KitStat title="Structure">
        Sponge & Keccak-p
      </KitStat>
      <KitStat title="Round">
        24
      </KitStat>
    </template>
  </ToolsLayout>
</template>
