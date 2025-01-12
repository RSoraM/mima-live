<script setup lang="ts">
defineOptions({ name: 'TupleHash' });

const t = ref(256);
const S = ref(new U8());
const variant = ref('TupleHash-128');
const variant_options: SelectOption[] = [
  { label: 'TupleHash-128', value: 'TupleHash-128' },
  { label: 'TupleHash-128 XOF', value: 'TupleHash-128 XOF' },
  { label: 'TupleHash-256', value: 'TupleHash-256' },
  { label: 'TupleHash-256 XOF', value: 'TupleHash-256 XOF' },
];
watchImmediate(variant, () => t.value = variant.value.startsWith('TupleHash-128') ? 256 : 512);
const hash = computed(() => {
  switch (variant.value) {
    case 'TupleHash-128':
      return tuplehash128(t.value, S.value);
    case 'TupleHash-128 XOF':
      return tuplehash128XOF(t.value, S.value);
    case 'TupleHash-256':
      return tuplehash256(t.value, S.value);
    case 'TupleHash-256 XOF':
      return tuplehash256XOF(t.value, S.value);
    default:
      return undefined;
  }
});

const i = ref<{ value: InstanceType<typeof U8> }[]>([
  { value: UTF8('mima-kit') },
  { value: new U8() },
  { value: new U8() },
]);
const I = computed(() => i.value.map(m => m.value));
const O = ref(new U8());

watchEffect(catchNotifySync(() => {
  O.value = hash.value ? hash.value(I.value) : new U8();
}));
</script>

<template>
  <ToolsLayout title="TupleHash">
    <template #body>
      <div class="flex flex-col md:flex-row md:gap-2">
        <KitFormSelect v-model="variant" title="Variant" :options="variant_options" />
        <KitFormNumber v-model="t" title="Digest Size (bit)" />
      </div>
      <KitFormU8 v-model="S" title="Customization" :immediate="true" :codec="UTF8" />
      <KitFormU8Array v-model="i" title="Input" :immediate="true" />
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
