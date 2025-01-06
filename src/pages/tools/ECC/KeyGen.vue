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
  <KitDivider class="divider-start">
    # Step 0: Choose Curve
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormSelectCurve v-model="curve" title="" class="w-full" />
  </div>
  <KitDivider class="divider-start">
    # Step 1: Key Generation
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormU8
      v-model="key.d"
      :codec="HEX"
      :title="`Private Key dA (${key.d_bit} bit)`"
    />
    <KitFormECCPoint
      v-model="key.Q"
      :curve="key.curve"
      name="Public Key QA"
      :x-bit="key.x_bit"
      :y-bit="key.y_bit"
    />
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="key.$reset()">
        Clear
      </KitButton>
      <KitButton @click="key.gen()">
        Generate
      </KitButton>
    </div>
  </div>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="key.curve" :codec="HEX" />
</template>
