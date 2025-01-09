<script setup lang="ts">
defineOptions({ name: 'KeyGen' });

const key = useECCKey();
const { curve } = storeToRefs(key);
onMounted(async () => key.gen());
</script>

<template>
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    Key Generation
  </h1>
  <KitStep num="0" title="Choose Curve">
    <KitFormSelectCurve v-model="curve" title="" class="w-full" />
  </KitStep>
  <KitStep num="1" title="Key Generation">
    <KitFormU8 v-model="key.d" :codec="HEX" :title="`Private Key dA (${key.d_bit} bit)`" />
    <KitFormECCPoint
      v-model="key.Q" :curve="key.curve"
      :x-bit="key.x_bit" :y-bit="key.y_bit"
      name="Public Key QA"
    />
    <template #action>
      <KitButton @click="key.$reset()">
        Clear
      </KitButton>
      <KitButton @click="key.gen()">
        Generate
      </KitButton>
    </template>
  </KitStep>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="key.curve" :codec="HEX" />
</template>
