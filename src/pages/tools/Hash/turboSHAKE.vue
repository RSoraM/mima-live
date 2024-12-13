<script setup lang="ts">
import { HEX, turboshake128, turboshake256, UTF8 } from 'mima-kit';

defineOptions({ name: 'TurboSHAKE' });

const t = ref(256);
const variants = ref('TurboSHAKE-128');
const variantOptions: SelectOption[] = [
  { label: 'TurboSHAKE-128', value: 'TurboSHAKE-128' },
  { label: 'TurboSHAKE-256', value: 'TurboSHAKE-256' },
];

const d = ref(0x1F);
const alg = computed(() => {
  switch (variants.value) {
    case 'TurboSHAKE-128':
      return turboshake128(t.value, d.value);
    case 'TurboSHAKE-256':
      return turboshake256(t.value, d.value);
    default:
      return undefined;
  }
});

const i = ref('mima-kit');
const i_codec = ref(UTF8);
const o = ref('');
const o_codec = ref(HEX);

watchEffect(() => {
  if (!alg.value)
    return;
  const I = i_codec.value(i.value);
  const res = alg.value(I);
  o.value = o_codec.value(res);
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      TurboSHAKE
    </h1>
    <KitFormControl title="Variant">
      <KitBaseFormSelect v-model="variants" :options="variantOptions" />
    </KitFormControl>
    <div class="flex gap-2">
      <KitFormInput v-model="t" type="number" title="Digest Size (bits)" />
      <KitFormInput v-model="d" type="number" title="Domain Separator" />
    </div>
    <KitFormTextAreaWithCodec v-model:text="i" v-model:codec="i_codec" title="Input" />
    <KitFormTextAreaWithCodec v-model:text="o" v-model:codec="o_codec" title="Output" />

    <div class="stats stats-vertical my-6 shadow">
      <KitStat title="Specification">
        <KitRefLink
          :texts="['TurboSHAKE']"
          icon="icon-[carbon--pdf-reference]"
          href="https://keccak.team/files/TurboSHAKE.pdf"
        />
      </KitStat>

      <KitStat title="Digest Size (bytes)">
        {{ alg?.DIGEST_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ alg?.BLOCK_SIZE }}
      </KitStat>

      <KitStat title="Structure">
        Sponge & Keccak-p
      </KitStat>

      <KitStat title="Round">
        12
      </KitStat>
    </div>
  </div>
</template>
