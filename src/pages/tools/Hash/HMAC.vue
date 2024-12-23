<script setup lang="ts">
defineOptions({ name: 'HMAC' });

const hash = ref(sm3);
const mac = computed(catchNotifySync(() => hmac(hash.value)));

const K = ref(new U8());
const I = ref(UTF8('mima-kit'));
const O = ref(new U8());

watchEffect(catchNotifySync(() => {
  O.value = mac.value(K.value, I.value);
}));
</script>

<template>
  <h1 class="mx-auto text-4xl font-bold md:my-8">
    HMAC
  </h1>
  <KitFormSelectHash v-model="hash" title="Hash" />
  <KitFormU8
    v-model="K" :codec="HEX"
    :immediate="true"
    title="Key"
  />
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
        :texts="['RFC 2104']"
        icon="icon-[carbon--txt-reference]"
        href="https://www.rfc-editor.org/rfc/rfc2104.txt"
      />
    </KitStat>

    <KitStat title="First published">
      1996
    </KitStat>

    <KitStat title="Recommended key size (byte)">
      {{ mac?.KEY_SIZE }}
    </KitStat>

    <KitStat title="Digest Size (byte)">
      {{ mac?.DIGEST_SIZE }}
    </KitStat>

    <KitStat title="Block Size (byte)">
      {{ mac?.BLOCK_SIZE }}
    </KitStat>
  </div>
</template>
