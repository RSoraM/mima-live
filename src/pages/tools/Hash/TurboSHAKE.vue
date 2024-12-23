<script setup lang="ts">
defineOptions({ name: 'TurboSHAKE' });

const t = ref(256);
const d = ref(0x1F);
const variant = ref('TurboSHAKE-128');
const variant_options: SelectOption[] = [
  { label: 'TurboSHAKE-128', value: 'TurboSHAKE-128' },
  { label: 'TurboSHAKE-256', value: 'TurboSHAKE-256' },
];
const hash = computed(catchNotifySync(() => {
  switch (variant.value) {
    case 'TurboSHAKE-128':
      return turboshake128(t.value, d.value);
    case 'TurboSHAKE-256':
      return turboshake256(t.value, d.value);
    default:
      return undefined;
  }
}));

const I = ref(UTF8('mima-kit'));
const O = ref(new U8());

watchEffect(catchNotifySync(() => {
  O.value = hash.value ? hash.value(I.value) : new U8();
}));
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      TurboSHAKE
    </h1>
    <KitFormControl title="Variant">
      <KitBaseFormSelect v-model="variant" :options="variant_options" />
    </KitFormControl>
    <div class="flex gap-2">
      <KitFormNumber v-model="t" title="Digest Size (bit)" />
      <KitFormNumber v-model="d" title="Domain Separator" />
    </div>
    <KitFormU8
      v-model="I" :codec="UTF8"
      :immediate="true"
      title="Input"
      textarea
    />
    <KitFormU8
      v-model="O"
      :codec="HEX"
      title="Output"
      textarea
    />

    <div class="stats stats-vertical my-6 shadow">
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
    </div>
  </div>
</template>
