<script setup lang="ts">
import { HEX, hmac, sm3, UTF8 } from 'mima-kit';

defineOptions({ name: 'HMAC' });

const hash = ref(sm3);
const alg = computed(catchNotifySync(() => hmac(hash.value)));

const k = ref('');
const k_codec = ref(UTF8);
const i = ref('mima-kit');
const i_codec = ref(UTF8);
const o = ref('');
const o_codec = ref(HEX);

watch(
  [k, i, alg],
  catchNotifySync(() => {
    if (!alg.value)
      return;
    const K = k_codec.value(k.value);
    const I = i_codec.value(i.value);
    const res = alg.value(K, I);
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
      HMAC
    </h1>
    <KitFormHashSelect v-model="hash" />
    <KitFormInputWithCodec v-model:text="k" v-model:codec="k_codec" title="Key" />
    <KitFormTextAreaWithCodec v-model:text="i" v-model:codec="i_codec" title="Input" />
    <KitFormTextAreaWithCodec v-model:text="o" v-model:codec="o_codec" title="Output" />

    <div class="stats stats-vertical my-6 shadow">
      <KitStat title="Specification">
        <KitRefLink
          :texts="['RFC 2104']"
          icon="icon-[carbon--txt-reference]"
          href="https://www.rfc-editor.org/rfc/rfc2104.txt"
        />
      </KitStat>

      <KitStat title="First published">
        1996
      </KitStat>

      <KitStat title="Recommended key size (byte)">
        {{ alg?.KEY_SIZE }}
      </KitStat>

      <KitStat title="Digest Size (bytes)">
        {{ alg?.DIGEST_SIZE }}
      </KitStat>

      <KitStat title="Block Size (bytes)">
        {{ alg?.BLOCK_SIZE }}
      </KitStat>
    </div>
  </div>
</template>
