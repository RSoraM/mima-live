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
  <ToolsLayout title="SM2-ES">
    <KitFoldCard title="0: Elliptic Curve" :open="false">
      <KitFormSelectCurve v-model="curve" class="w-full" />
    </KitFoldCard>
    <KitFoldCard title="1: Key Pair" :open="false">
      <template #action>
        <KitButton @click="key.$reset()">
          Clear
        </KitButton>
        <KitButton @click="key.gen()">
          Generate
        </KitButton>
      </template>
      <KitFormU8
        v-model="key.d" :codec="HEX"
        :title="`Private Key dA (${key.d_bit} bit)`"
      />
      <KitFormECCPoint
        v-model="key.Q" :curve="curve"
        :x-bit="key.x_bit" :y-bit="key.y_bit"
        name="Public Key QA"
      />
    </KitFoldCard>
    <KitFoldCard title="2: ES Components" :open="false">
      <KitFoldCard title="2.1: Hash Algorithm" :open="false">
        <KitFormSelectHash v-model="hash" class="w-full" />
      </KitFoldCard>
      <KitFoldCard title="2.2: KDF Algorithm" class="mt-2" :open="false">
        <KitFormSelectKDF v-model="kdf" title-prefix="2.2." class="w-full" />
      </KitFoldCard>
      <KitFoldCard title="2.3: Ciphertext Order" class="mt-2" :open="false">
        <KitFormSelect v-model="order" :options="order_options" class="w-full" />
      </KitFoldCard>
    </KitFoldCard>
    <KitFoldCard title="3: Encryption" :open="false">
      <template #action>
        <KitButton @click="encrypt()">
          Encrypt
        </KitButton>
        <KitButton @click="decrypt()">
          Decrypt
        </KitButton>
      </template>
      <KitFormU8 v-model="M" :title="`Plaintext M (${M.length} bytes)`" textarea :immediate="true" :codec="UTF8" />
      <KitFormU8 v-model="C" :title="`Ciphertext C (${C.length} bytes)`" textarea :codec="HEX" />
    </KitFoldCard>

    <!-- Curve Parameters -->
    <KitFoldCard title="Appendix: Curve Parameters" :open="false">
      <KitCurveTable :curve="curve" :codec="HEX" />
    </KitFoldCard>
  </ToolsLayout>
</template>
