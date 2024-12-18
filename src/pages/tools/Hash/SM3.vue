<script setup lang="ts">
import { HEX, sm3, UTF8 } from 'mima-kit';

defineOptions({ name: 'SM3' });

const i = ref('mima-kit');
const i_codec = ref(UTF8);
const o = ref('');
const o_codec = ref(HEX);

watch(
  i,
  catchNotifySync(() => {
    const I = i_codec.value(i.value);
    const res = sm3(I);
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
      SM3
    </h1>
    <KitFormTextAreaWithCodec v-model:text="i" v-model:codec="i_codec" title="Input" />
    <KitFormTextAreaWithCodec v-model:text="o" v-model:codec="o_codec" title="Output" />

    <div class="stats stats-vertical my-6 shadow">
      <KitStat title="Specification">
        <KitRefLink
          :texts="['GM/T', '0004-2012']"
          icon="icon-[carbon--pdf-reference]"
          href="https://oscca.gov.cn/sca/xxgk/2010-12/17/1002389/files/302a3ada057c4a73830536d03e683110.pdf"
        />
      </KitStat>

      <KitStat title="First published">
        2010
      </KitStat>

      <KitStat title="Digest Size (bytes)">
        {{ sm3.DIGEST_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ sm3.BLOCK_SIZE }}
      </KitStat>

      <KitStat title="Structure">
        Merkle-Damgård
      </KitStat>

      <KitStat title="Round">
        64
      </KitStat>
    </div>
  </div>
</template>
