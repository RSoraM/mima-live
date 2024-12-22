<script setup lang="ts">
import type { ZUCParams } from 'mima-kit';

defineOptions({ name: 'ZUC' });

const BEARER = ref(0xF);
const DIRECTION = ref<0 | 1>(0);
const COUNTER = ref(HEX('66035492'));
const K = ref(HEX('173D14BA5003731D7A60049470F00A29'));
const I = ref(HEX('6CF65340735552AB0C9752FA6F9025FE0BD675D9005875B2'));
const I_LENGTH = ref(0xC1);
const O = ref(HEX('a6c85fc66afb8533aafc2518dfe784940ee1e4b030238cc8'));
const T = ref(HEX('19fe6c23'));
const direction_options = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
];

const cipher = catchNotify(() => {
  const params: ZUCParams = {
    COUNTER: COUNTER.value,
    BEARER: BEARER.value,
    DIRECTION: DIRECTION.value,
    KEY: K.value,
    LENGTH: I_LENGTH.value,
    M: I.value,
  };

  O.value = eea3(params);
  T.value = eia3(params);
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      ZUC
    </h1>
    <div class="flex gap-2">
      <KitFormInput v-model="BEARER" type="number" title="Bearer" />
      <KitFormControl title="Direction">
        <KitBaseFormSelect v-model="DIRECTION" :options="direction_options" />
      </KitFormControl>
    </div>
    <KitFormU8
      v-model:buffer="COUNTER"
      :codec="HEX"
      title="Counter"
    />
    <KitFormU8
      v-model:buffer="K"
      :codec="HEX"
      title="Key"
    />
    <KitFormInput v-model="I_LENGTH" type="number" title="Input Length (bit)" />
    <KitFormU8
      v-model:buffer="I"
      :codec="HEX"
      title="Input"
      textarea
    />
    <div class="divider my-8">
      <KitButton @click="cipher">
        Cipher
      </KitButton>
    </div>
    <KitFormU8
      v-model:buffer="O"
      :codec="HEX"
      title="Output"
      textarea
    />
    <KitFormU8
      v-model:buffer="T"
      :codec="HEX"
      title="Mac"
      textarea
    />

    <div role="alert" class="alert alert-warning my-4">
      <span class="icon-[carbon--warning-alt-filled] size-6" />
      <span class="text-sm">
        In the original specification,
        the <b>Input Length</b> is calculated using the <b>sizeof</b> operator in C.
        However, in JavaScript, there is no equivalent operation to <b>sizeof</b>,
        so it needs to be specified manually.
      </span>
    </div>

    <div class="stats stats-vertical my-6 shadow">
      <KitStat title="Specification">
        <KitRefLink
          :texts="['GB/T', '33133.1-2016']"
          icon="icon-[carbon--html-reference]"
          href="https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=8C41A3AEECCA52B5C0011C8010CF0715"
        />
        <KitRefLink
          :texts="['33133.2-2016']"
          icon="icon-[carbon--html-reference]"
          href="https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=5D3CBA3ADEC7989344BD1E63006EF2B3"
        />
        <KitRefLink
          :texts="['33133.3-2016']"
          icon="icon-[carbon--html-reference]"
          href="https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=C6D60AE0A7578E970EF2280ABD49F4F0"
        />
      </KitStat>

      <KitStat title="First published">
        2016
      </KitStat>

      <KitStat title="Key Size (bytes)">
        16
      </KitStat>
    </div>
  </div>
</template>
