<script setup lang="ts">
defineOptions({ name: 'KitFormSelectKDF' });

const {
  options: kdf_options = [
    { label: 'ANSI X9.63', value: 'ANSI X9.63' },
    { label: 'HKDF', value: 'HKDF' },
    { label: 'PBKDF2', value: 'PBKDF2' },
  ],
  titlePrefix = '',
  title = '',
  titleSuffix = '',
} = defineProps<{
  options?: SelectOption[];
  titlePrefix?: string;
  title?: string;
  titleSuffix?: string;
}>();

const kdf_alg = ref('ANSI X9.63');
const kdf_hash = ref(sha256);
const kdf_mac = ref(hmac(sha256));
const kdf_salt = ref(new U8());
const kdf_iterations = ref(5000);

const kdf = defineModel<ReturnType<typeof x963kdf>>({ required: true });

const show_hash = computed(() => kdf_alg.value === 'ANSI X9.63');
const show_salt = computed(() => kdf_alg.value !== 'ANSI X9.63');
const show_mac = computed(() => kdf_alg.value !== 'ANSI X9.63');
const show_iterations = computed(() => kdf_alg.value === 'PBKDF2');

watchEffect(catchNotifySync(() => {
  const S = kdf_salt.value;
  if (kdf_alg.value === 'ANSI X9.63') {
    kdf.value = x963kdf(kdf_hash.value);
  }
  else if (kdf_alg.value === 'HKDF') {
    kdf.value = hkdf(kdf_mac.value, S);
  }
  else if (kdf_alg.value === 'PBKDF2') {
    kdf.value = pbkdf2(kdf_mac.value, S, kdf_iterations.value);
  }
}));
</script>

<template>
  <KitFormSelect
    v-model="kdf_alg"
    :options="kdf_options"
    :title="title"
    :="$attrs"
  />
  <template v-if="show_hash">
    <KitFoldCard :title="`${titlePrefix}1: Hash Algorithm${titleSuffix}`" class="mt-2" :open="false">
      <KitFormSelectHash v-model="kdf_hash" class="w-full" />
    </KitFoldCard>
  </template>
  <template v-if="show_mac">
    <KitFoldCard :title="`${titlePrefix}1: Mac Algorithm${titleSuffix}`" class="mt-2" :open="false">
      <KitFormSelectMAC v-model="kdf_mac" :title-prefix="`${titlePrefix}1.`" class="w-full" />
    </KitFoldCard>
  </template>
  <template v-if="show_salt">
    <KitFoldCard :title="`${titlePrefix}2: Salt${titleSuffix}`" class="mt-2" :open="false">
      <KitFormU8 v-model="kdf_salt" :codec="UTF8" class="w-full" />
    </KitFoldCard>
  </template>
  <template v-if="show_iterations">
    <KitFoldCard :title="`${titlePrefix}3: Iterations${titleSuffix}`" class="mt-2" :open="false">
      <KitFormNumber v-model="kdf_iterations" class="w-full" />
    </KitFoldCard>
  </template>
</template>
