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
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      KMAC
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
      v-model:buffer="K"
      :codec="HEX"
      title="Key"
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
          :texts="['NIST', 'SP.800-185']"
          icon="icon-[carbon--pdf-reference]"
          href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-185.pdf"
        />
      </KitStat>

      <KitStat title="First published">
        2016
      </KitStat>

      <KitStat title="Digest Size (bytes)">
        {{ mac?.DIGEST_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ mac?.BLOCK_SIZE }}
      </KitStat>

      <KitStat title="Structure">
        Sponge & Keccak-p
      </KitStat>

      <KitStat title="Round">
        24
      </KitStat>
    </div>
  </div>
</template>
