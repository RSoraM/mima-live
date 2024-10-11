<script setup lang="ts">
import type { ZUCConfig, ZUCParams } from 'mima-kit';
import { eea3, eia3, HEX } from 'mima-kit';

defineOptions({ name: 'ZUC' });

const bearer = ref(0xF);
const direction = ref<0 | 1>(0);
const counter = ref('66035492');
const counter_codec = ref(HEX);
const k = ref('173D14BA5003731D7A60049470F00A29');
const k_codec = ref(HEX);
const i = ref('6CF65340735552AB0C9752FA6F9025FE0BD675D9005875B2');
const i_codec = ref(HEX);
const i_length = ref(0xC1);
const o = ref('a6c85fc66afb8533aafc2518dfe784940ee1e4b030238cc8');
const o_codec = ref(HEX);
const t = ref('19fe6c23');
const t_codec = ref(HEX);
const direction_options = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
];

const cipher = catchNotify(() => {
  const params: ZUCParams = {
    COUNTER: counter.value,
    BEARER: bearer.value,
    DIRECTION: direction.value,
    KEY: k.value,
    LENGTH: i_length.value,
    M: i.value,
  };
  const config: ZUCConfig = {
    COUNTER_CODEC: counter_codec.value,
    KEY_CODEC: k_codec.value,
    INPUT_CODEC: i_codec.value,
  };

  const res_cipher = eea3(params, config);
  o.value = HEX.stringify(res_cipher);
  const res_mac = eia3(params, config);
  t.value = t_codec.value.stringify(res_mac);
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      ZUC
    </h1>
    <div class="flex gap-2">
      <KitFormInput v-model="bearer" type="number" title="Bearer" />
      <KitFormControl title="Direction">
        <KitBaseFormSelect v-model="direction" :options="direction_options" />
      </KitFormControl>
    </div>
    <KitFormInputWithCodec v-model:text="counter" v-model:codec="counter_codec" title="Counter" />
    <KitFormInputWithCodec v-model:text="k" v-model:codec="k_codec" title="Key" />
    <KitFormInput v-model="i_length" type="number" title="Input length" />
    <KitFormTextAreaWithCodec v-model:text="i" v-model:codec="i_codec" title="Input" />
    <div class="divider my-8">
      <button
        class="btn btn-outline btn-sm"
        @click="cipher"
      >
        Cipher
      </button>
    </div>
    <KitFormTextAreaWithCodec v-model:text="o" v-model:codec="o_codec" title="Output" />
    <KitFormTextAreaWithCodec v-model:text="t" v-model:codec="t_codec" title="Mac" />

    <div role="alert" class="alert alert-warning my-4">
      <span class="icon-[carbon--warning-alt-filled] size-6" />
      <span class="text-sm">
        In the original specification,
        the <b>Input length</b> is calculated using the <b>sizeof</b> operator in C.
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

      <KitStat title="Key Size">
        16 bytes
      </KitStat>
    </div>
  </div>
</template>
