<script setup lang="ts">
defineOptions({ name: 'KitFormSelectKDF' });

const {
  options: kdf_options = [
    { label: 'ANSI X9.63', value: 'ANSI X9.63' },
    { label: 'HKDF', value: 'HKDF' },
    { label: 'PBKDF2', value: 'PBKDF2' },
  ],
} = defineProps<{
  title: string;
  options?: SelectOption[];
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
  <div>
    <KitFormControl :title="title">
      <KitBaseFormSelect v-model="kdf_alg" :options="kdf_options" />
    </KitFormControl>
    <KitCollapse class="input-bordered my-2 border bg-base-300">
      <template #header>
        <span class="text-sm font-bold">KDF Config</span>
      </template>
      <template v-if="show_hash">
        <div class="divider divider-start my-4 text-sm">
          # 1: Hash
        </div>
        <KitFormSelectHash
          v-model="kdf_hash"
          :title="`${title} Hash`"
        />
      </template>
      <template v-if="show_mac">
        <div class="divider divider-start my-4 text-sm">
          # 1: Mac
        </div>
        <KitFormSelectMAC
          v-model="kdf_mac"
          :title="`${title} MAC`"
        />
      </template>
      <template v-if="show_salt">
        <div class="divider divider-start my-4 text-sm">
          # 2: Salt
        </div>
        <KitFormU8
          v-model="kdf_salt"
          :title="`${title} Salt`"
          :codec="UTF8"
        />
      </template>
      <template v-if="show_iterations">
        <div class="divider divider-start my-4 text-sm">
          # 3: Iterations
        </div>
        <KitFormNumber
          v-model="kdf_iterations"
          :title="`${title} Iterations`"
        />
      </template>
    </KitCollapse>
  </div>
</template>
