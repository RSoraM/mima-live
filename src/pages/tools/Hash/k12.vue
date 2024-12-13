<script setup lang="ts">
import { HEX, kt128, kt256, UTF8 } from 'mima-kit';

defineOptions({ name: 'KangarooTwelve' });

const variants = ref('kt-128');
const variantOptions: SelectOption[] = [
  { label: 'kt-128', value: 'kt-128' },
  { label: 'kt-256', value: 'kt-256' },
];

const t = ref(256);
const s = ref('');
const s_codec = ref(UTF8);
const alg = computed(() => {
  const S = s_codec.value(s.value);
  switch (variants.value) {
    case 'kt-128':
      return kt128(t.value, S);
    case 'kt-256':
      return kt256(t.value, S);
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
      KangarooTwelve
    </h1>
    <div class="flex gap-2">
      <KitFormControl title="Variant">
        <KitBaseFormSelect v-model="variants" :options="variantOptions" />
      </KitFormControl>
      <KitFormInput
        v-model="t" type="number"
        title="Digest Size (bits)"
      />
    </div>
    <KitFormInputWithCodec v-model:text="s" v-model:codec="s_codec" title="Customization" />
    <KitFormTextAreaWithCodec v-model:text="i" v-model:codec="i_codec" title="Input" />
    <KitFormTextAreaWithCodec v-model:text="o" v-model:codec="o_codec" title="Output" />

    <div class="stats stats-vertical my-6 shadow">
      <KitStat title="Specification">
        <KitRefLink
          :texts="['KangarooTwelve']"
          icon="icon-[carbon--pdf-reference]"
          href="https://keccak.team/files/KangarooTwelve.pdf"
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
