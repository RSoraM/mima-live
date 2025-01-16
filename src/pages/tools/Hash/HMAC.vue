<script setup lang="ts">
defineOptions({ name: 'HMAC' });

const hash = ref(sm3);
const mac = computed(() => hmac(hash.value));

const K = ref(new U8());
const I = ref(UTF8('mima-kit'));
const O = ref(new U8());

watchEffect(catchNotifySync(() => {
  O.value = mac.value(K.value, I.value);
}));
</script>

<template>
  <ToolsLayout title="HMAC">
    <template #body>
      <KitFormSelectHash v-model="hash" title="Hash" />
      <KitFormU8 v-model="K" title="Key" :immediate="true" :codec="HEX" />
      <KitFormU8 v-model="I" title="Input" :immediate="true" textarea :codec="UTF8" />
      <KitFormU8 v-model="O" title="Output" textarea :codec="HEX" />
    </template>
    <template #stat>
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
    </template>
  </ToolsLayout>
</template>
