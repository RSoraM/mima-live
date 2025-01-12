<script setup lang="ts">
defineOptions({ name: 'CSHAKE' });

const t = ref(256);
const N = ref(new U8());
const S = ref(new U8());
const variant = ref('cSHAKE-128');
const variant_options: SelectOption[] = [
  { label: 'cSHAKE-128', value: 'cSHAKE-128' },
  { label: 'cSHAKE-256', value: 'cSHAKE-256' },
];
watchImmediate(variant, () => t.value = variant.value === 'cSHAKE-128' ? 256 : 512);
const hash = computed(() => {
  switch (variant.value) {
    case 'cSHAKE-128':
      return cshake128(t.value, N.value, S.value);
    case 'cSHAKE-256':
      return cshake256(t.value, N.value, S.value);
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
  <ToolsLayout title="cSHAKE">
    <template #body>
      <div class="flex flex-col md:flex-row md:gap-2">
        <KitFormSelect v-model="variant" title="Variant" :options="variant_options" />
        <KitFormNumber v-model="t" title="Digest Size (bit)" />
      </div>
      <KitFormU8 v-model="N" title="Function-Name" :immediate="true" :codec="UTF8" />
      <KitFormU8 v-model="S" title="Customization" :immediate="true" :codec="UTF8" />
      <KitFormU8 v-model="I" title="Input" :immediate="true" textarea :codec="UTF8" />
      <KitFormU8 v-model="O" title="Output" textarea :codec="HEX" />
    </template>
    <template #stat>
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
