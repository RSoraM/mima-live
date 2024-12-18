<script setup lang="ts">
import { HEX, kt128, kt256, UTF8 } from 'mima-kit';

defineOptions({ name: 'KangarooTwelve' });

const t = ref(256);
const s = ref('');
const s_codec = ref(UTF8);
const variant = ref('KangarooTwelve-128');
const variant_options: SelectOption[] = [
  { label: 'KangarooTwelve-128', value: 'KangarooTwelve-128' },
  { label: 'KangarooTwelve-256', value: 'KangarooTwelve-256' },
];
const alg = computed(() => {
  switch (variant.value) {
    case 'KangarooTwelve-128':
      return kt128;
    case 'KangarooTwelve-256':
      return kt256;
    default:
      return undefined;
  }
});
const hash = ref<ReturnType<typeof kt128>>();

const i = ref('mima-kit');
const i_codec = ref(UTF8);
const o = ref('');
const o_codec = ref(HEX);

watch(
  [i, alg, t, s],
  catchNotifySync(() => {
    if (!alg.value)
      return;
    const S = s_codec.value(s.value);
    hash.value = alg.value(t.value, S);
    const I = i_codec.value(i.value);
    const res = hash.value(I);
    o.value = o_codec.value(res);
  }),
  {
    immediate: true,
  },
);
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      KangarooTwelve
    </h1>
    <div class="flex gap-2">
      <KitFormControl title="Variant">
        <KitBaseFormSelect v-model="variant" :options="variant_options" />
      </KitFormControl>
      <KitFormInput
        v-model="t" type="number"
        title="Digest Size (bit)"
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
        {{ hash?.DIGEST_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ hash?.BLOCK_SIZE }}
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
