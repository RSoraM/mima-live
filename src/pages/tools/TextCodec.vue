<script setup lang="ts">
import { HEX, UTF8 } from 'mima-kit';

const autoConvert = ref(true);
const i = ref('mima-kit');
const o = ref('');
const i_codec = ref(UTF8);
const o_codec = ref(HEX);

function convert() {
  o.value = o_codec.value(i_codec.value(i.value));
}
function swap() {
  [i.value, o.value] = [o.value, i.value];
  [i_codec.value, o_codec.value] = [o_codec.value, i_codec.value];
}

watchEffect(() => {
  if (!autoConvert.value)
    return;
  convert();
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      Text Codec
    </h1>
    <KitFormToggle v-model="autoConvert" title="Auto Convert" />
    <KitFormTextAreaWithCodec v-model:text="i" v-model:codec="i_codec" title="Input" />
    <div class="divider my-8">
      <button
        class="btn btn-outline btn-sm"
        @click="convert"
      >
        Convert
      </button>
      /
      <button
        class="btn btn-outline btn-sm"
        @click="swap"
      >
        swap
      </button>
    </div>
    <KitFormTextAreaWithCodec v-model:text="o" v-model:codec="o_codec" title="Output" />

    <div class="stats stats-vertical my-6 shadow">
      <KitStat title="Input Format">
        {{ i_codec.FORMAT.toUpperCase() }}
      </KitStat>

      <KitStat title="Output Format">
        {{ o_codec.FORMAT.toUpperCase() }}
      </KitStat>
    </div>
  </div>
</template>
