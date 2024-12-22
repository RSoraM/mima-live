<script setup lang="ts">
defineOptions({ name: 'KangarooTwelve' });

const t = ref(256);
const S = ref(new U8());
const variant = ref('KangarooTwelve-128');
const variant_options: SelectOption[] = [
  { label: 'KangarooTwelve-128', value: 'KangarooTwelve-128' },
  { label: 'KangarooTwelve-256', value: 'KangarooTwelve-256' },
];
const hash = computed(() => {
  switch (variant.value) {
    case 'KangarooTwelve-128':
      return kt128(t.value, S.value);
    case 'KangarooTwelve-256':
      return kt256(t.value, S.value);
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
    <KitFormU8
      v-model:buffer="S"
      :codec="UTF8"
      title="Customization"
    />
    <KitFormU8
      v-model:buffer="I"
      :codec="UTF8"
      title="Input"
      textarea
    />
    <KitFormU8
      v-model:buffer="O"
      :codec="HEX"
      title="Output"
      textarea
    />

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
