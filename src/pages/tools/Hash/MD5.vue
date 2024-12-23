<script setup lang="ts">
defineOptions({ name: 'MD5' });

const I = ref(UTF8('mima-kit'));
const O = ref(new U8());

watchEffect(catchNotifySync(() => {
  O.value = md5(I.value);
}));
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      MD5
    </h1>
    <KitFormU8
      v-model="I"
      :codec="UTF8"
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
