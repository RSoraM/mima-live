<script setup lang="ts">
defineOptions({ name: 'KMAC' });

const t = ref(256);
const S = ref(new U8());
const variant = ref('KMAC-128');
const variant_options: SelectOption[] = [
  { label: 'KMAC-128', value: 'KMAC-128' },
  { label: 'KMAC-128 XOF', value: 'KMAC-128 XOF' },
  { label: 'KMAC-256', value: 'KMAC-256' },
  { label: 'KMAC-256 XOF', value: 'KMAC-256 XOF' },
];
watchImmediate(variant, () => t.value = variant.value.startsWith('KMAC-128') ? 256 : 512);
const mac = computed(() => {
  switch (variant.value) {
    case 'KMAC-128':
      return kmac128(t.value, S.value);
    case 'KMAC-128 XOF':
      return kmac128XOF(t.value, S.value);
    case 'KMAC-256':
      return kmac256(t.value, S.value);
    case 'KMAC-256 XOF':
      return kmac256XOF(t.value, S.value);
    default:
      return undefined;
  }
});

const K = ref(new U8());
const I = ref(UTF8('mima-kit'));
const O = ref(new U8());

watchEffect(catchNotifySync(() => {
  O.value = mac.value ? mac.value(K.value, I.value) : new U8();
}));
</script>

<template>
  <ToolsLayout title="KMAC">
    <template #body>
      <div class="flex flex-col md:flex-row md:gap-2">
        <KitFormSelect v-model="variant" title="Variant" :options="variant_options" />
        <KitFormNumber v-model="t" title="Digest Size (bit)" />
      </div>
      <KitFormU8 v-model="S" title="Customization" :immediate="true" :codec="UTF8" />
      <KitFormU8 v-model="K" title="Key" :immediate="true" :codec="HEX" />
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
        {{ mac?.DIGEST_SIZE }}
      </KitStat>
      <KitStat title="Block Size (byte)">
        {{ mac?.BLOCK_SIZE }}
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
