<script setup lang="ts">
defineOptions({ name: 'SM2ES' });

const key = useSM2Key();
key.gen();
const { curve } = storeToRefs(key);
const ec = computed(() => sm2(curve.value));
const hash = ref(sm3);
const kdf = ref(ref(x963kdf(sm3)));
const order = ref<'c1c2c3' | 'c1c3c2'>('c1c3c2');
const order_options: SelectOption[] = [
  { value: 'c1c2c3', label: 'c1c2c3' },
  { value: 'c1c3c2', label: 'c1c3c2' },
];

const cipher = computed(() => ec.value.es(hash.value, kdf.value, order.value));

const M = ref(UTF8('mima-kit'));
const C = ref(new U8());

const encrypt = catchNotify(() => C.value = cipher.value.encrypt(key, M.value));
const decrypt = catchNotify(() => M.value = cipher.value.decrypt(key, C.value));

watch(
  curve,
  catchNotifySync(() => key.$reset()),
);

onMounted(async () => encrypt());
</script>

<template>
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    SM2-ES
  </h1>
  <KitDivider class="divider-start">
    # Step 0: Choose Curve
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormSelectCurve v-model="curve" title="" class="w-full" />
  </div>
  <KitDivider class="divider-start">
    # Step 1: Choose Hash Algorithm
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormSelectHash v-model="hash" title="" class="w-full" />
  </div>
  <KitDivider class="divider-start">
    # Step 2: Choose KDF Algorithm
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormSelectKDF v-model="kdf" title="" class="w-full" />
  </div>
  <KitDivider class="divider-start">
    # Step 3: Choose Ciphertext Order
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormSelect
      v-model="order"
      :options="order_options"
      title=""
      class="w-full"
    />
  </div>
  <KitDivider class="divider-start">
    # Step 4: Key Generation
  </KitDivider>
  <div class="border-l pl-4">
    <div class="flex justify-center gap-4 pb-4">
      <KitButton @click="key.$reset()">
        Clear
      </KitButton>
      <KitButton @click="key.gen()">
        Generate
      </KitButton>
    </div>
    <KitFormU8
      v-model="key.d"
      :codec="HEX"
      :title="`Private Key dA (${key.d_bit} bit)`"
    />
    <KitFormECCPoint
      v-model="key.Q"
      :curve="curve"
      name="Public Key QA"
      :x-bit="key.x_bit"
      :y-bit="key.y_bit"
    />
  </div>
  <KitDivider class="divider-start">
    # Step 5: Encryption
  </KitDivider>
  <div class="border-l pl-4">
    <div class="flex justify-center gap-4 pb-4">
      <KitButton @click="encrypt()">
        Encrypt
      </KitButton>
      <KitButton @click="decrypt()">
        Decrypt
      </KitButton>
    </div>
    <KitFormU8
      v-model="M"
      :codec="UTF8"
      :immediate="true"
      :title="`Plaintext M (${M.length} bytes)`"
      textarea
    />
    <KitFormU8
      v-model="C"
      :codec="HEX"
      :title="`Ciphertext C (${C.length} bytes)`"
      textarea
    />
  </div>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
