<script setup lang="ts">
defineOptions({ name: 'MD5' });

const I = ref(UTF8('mima-kit'));
const O = ref(new U8());

watchEffect(catchNotifySync(() => {
  O.value = md5(I.value);
}));
</script>

<template>
  <ToolsLayout title="MD5">
    <template #body>
      <KitFormU8 v-model="I" title="Input" :immediate="true" textarea :codec="UTF8" />
      <KitFormU8 v-model="O" title="Output" textarea :codec="HEX" />
    </template>
    <template #stat>
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
      <KitStat title="Digest Size (byte)">
        {{ md5.DIGEST_SIZE }}
      </KitStat>
      <KitStat title="Block Size (byte)">
        {{ md5.BLOCK_SIZE }}
      </KitStat>
      <KitStat title="Structure">
        Merkle-Damgård
      </KitStat>
      <KitStat title="Round">
        4
      </KitStat>
    </template>
  </ToolsLayout>
</template>
