<script setup lang="ts">
import { HEX, md5, UTF8 } from 'mima-kit';

defineOptions({ name: 'MD5' });

const i = ref('mima-kit');
const i_codec = ref(UTF8);
const o = ref('');
const o_codec = ref(HEX);

watch(
  i,
  catchNotifySync(() => {
    const I = i_codec.value(i.value);
    const res = md5(I);
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
      MD5
    </h1>
    <KitFormTextAreaWithCodec v-model:text="i" v-model:codec="i_codec" title="Input" />
    <KitFormTextAreaWithCodec v-model:text="o" v-model:codec="o_codec" title="Output" />

    <div class="stats stats-vertical my-6 shadow">
      <KitStat title="Specification">
        <KitRefLink
          :texts="['RFC 1321']"
          icon="icon-[carbon--txt-reference]"
          href="https://www.rfc-editor.org/rfc/rfc1321.txt"
        />
      </KitStat>

      <KitStat title="First published">
        1992
      </KitStat>

      <KitStat title="Digest Size (bytes)">
        {{ md5.DIGEST_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ md5.BLOCK_SIZE }}
      </KitStat>

      <KitStat title="Structure">
        Merkle-Damgård
      </KitStat>

      <KitStat title="Round">
        4
      </KitStat>
    </div>
  </div>
</template>
