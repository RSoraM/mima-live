<script setup lang="ts">
defineOptions({ name: 'KeyGen' });

const key = useECCKey();
const { curve } = storeToRefs(key);
onMounted(async () => key.gen());
</script>

<template>
  <ToolsLayout title="Key Generation">
    <KitFoldCard title="Elliptic Curve" :open="false">
      <KitFormSelectCurve v-model="curve" class="w-full" />
    </KitFoldCard>
    <KitFoldCard title="Key Pair" :open="false">
      <template #action>
        <KitButton @click="key.$reset()">
          Clear
        </KitButton>
        <KitButton @click="key.gen()">
          Generate
        </KitButton>
      </template>
      <ul class="mb-2 ml-6 list-disc text-xs">
        <li>PrivateKey <b><u>d</u></b>.</li>
        <li>PublicKey <b><u>Q</u></b>.</li>
      </ul>
      <KitFormU8
        v-model="key.d" :codec="HEX"
        :title="`d (${key.d_bit} bit)`"
      />
      <KitFormECCPoint
        v-model="key.Q" :curve="key.curve"
        :x-bit="key.x_bit" :y-bit="key.y_bit"
        name="Q"
      />
    </KitFoldCard>

    <KitFoldCard title="Appendix: Curve Parameters" :open="false">
      <KitCurveTable :curve="key.curve" :codec="HEX" />
    </KitFoldCard>
  </ToolsLayout>
</template>
