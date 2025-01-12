<script setup lang="ts">
defineOptions({ name: 'ParallelHash' });

const t = ref(256);
const b = ref(1024);
const S = ref(new U8());
const variant = ref('ParallelHash-128');
const variant_options: SelectOption[] = [
  { label: 'ParallelHash-128', value: 'ParallelHash-128' },
  { label: 'ParallelHash-128 XOF', value: 'ParallelHash-128 XOF' },
  { label: 'ParallelHash-256', value: 'ParallelHash-256' },
  { label: 'ParallelHash-256 XOF', value: 'ParallelHash-256 XOF' },
];
watchImmediate(variant, () => t.value = variant.value.startsWith('ParallelHash-128') ? 256 : 512);
const hash = computed(() => {
  switch (variant.value) {
    case 'ParallelHash-128':
      return parallelhash128(b.value, t.value, S.value);
    case 'ParallelHash-128 XOF':
      return parallelhash128XOF(b.value, t.value, S.value);
    case 'ParallelHash-256':
      return parallelhash256(b.value, t.value, S.value);
    case 'ParallelHash-256 XOF':
      return parallelhash256XOF(b.value, t.value, S.value);
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
  <ToolsLayout title="ParallelHash">
    <template #body>
      <KitFormSelect v-model="variant" title="Variant" :options="variant_options" />
      <div class="flex flex-col md:flex-row md:gap-2">
        <KitFormNumber v-model="t" title="Digest Size (bit)" />
        <KitFormNumber v-model="b" title="Block size (bit)" />
      </div>
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
