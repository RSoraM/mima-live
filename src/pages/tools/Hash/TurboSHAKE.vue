<script setup lang="ts">
defineOptions({ name: 'TurboSHAKE' });

const t = ref(256);
const d = ref(0x1F);
const variant = ref('TurboSHAKE-128');
const variant_options: SelectOption[] = [
  { label: 'TurboSHAKE-128', value: 'TurboSHAKE-128' },
  { label: 'TurboSHAKE-256', value: 'TurboSHAKE-256' },
];
watchImmediate(variant, () => t.value = variant.value === 'TurboSHAKE-128' ? 256 : 512);
const hash = computed(() => {
  switch (variant.value) {
    case 'TurboSHAKE-128':
      return turboshake128(t.value, d.value);
    case 'TurboSHAKE-256':
      return turboshake256(t.value, d.value);
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
  <ToolsLayout title="TurboSHAKE">
    <template #body>
      <KitFormSelect v-model="variant" title="Variant" :options="variant_options" />
      <div class="flex flex-col md:flex-row md:gap-2">
        <KitFormNumber v-model="t" title="Digest Size (bit)" />
        <KitFormNumber v-model="d" title="Domain Separator" />
      </div>
      <KitFormU8 v-model="I" title="Input" :immediate="true" textarea :codec="UTF8" />
      <KitFormU8 v-model="O" title="Output" textarea :codec="HEX" />
    </template>
    <template #stat>
      <KitStat title="Specification">
        <KitRefLink
          :texts="['TurboSHAKE']"
          icon="icon-[carbon--pdf-reference]"
          href="https://keccak.team/files/TurboSHAKE.pdf"
        />
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
        12
      </KitStat>
    </template>
  </ToolsLayout>
</template>
