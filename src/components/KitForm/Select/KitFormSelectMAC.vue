<script setup lang="ts">
defineOptions({ name: 'KitFormSelectMAC' });

const {
  options: mac_options = [
    { label: 'HMAC', value: 'HMAC' },
    { label: 'KMAC128', value: 'KMAC128' },
    { label: 'KMAC128XOF', value: 'KMAC128XOF' },
    { label: 'KMAC256', value: 'KMAC256' },
    { label: 'KMAC256XOF', value: 'KMAC256XOF' },
  ],
} = defineProps<{
  title: string;
  options?: SelectOption[];
}>();

// parameters
const mac_alg = ref('HMAC');
const mac_hash = ref(sha256);
const mac_digest_size = ref(0);
const mac_key_size = ref(0);
const mac_custom = ref(new U8());
watchImmediate(mac_alg, () => {
  if (mac_alg.value === 'HMAC') {
    mac_key_size.value = mac_hash.value.DIGEST_SIZE << 3;
    mac_digest_size.value = mac_hash.value.DIGEST_SIZE << 3;
  }
  else if (mac_alg.value === 'KMAC128' || mac_alg.value === 'KMAC128XOF') {
    mac_key_size.value = 128;
    mac_digest_size.value = 256;
  }
  else if (mac_alg.value === 'KMAC256' || mac_alg.value === 'KMAC256XOF') {
    mac_key_size.value = 256;
    mac_digest_size.value = 512;
  }
});
watchImmediate(mac_hash, () => {
  mac_key_size.value = mac_hash.value.DIGEST_SIZE << 3;
  mac_digest_size.value = mac_hash.value.DIGEST_SIZE << 3;
});

const mac = defineModel<ReturnType<typeof hmac>>({ required: true });
watchEffect(catchNotifySync(() => {
  const algorithm = mac_alg.value;
  // hmac
  const hash = mac_hash.value;
  // kmac
  const customization = mac_custom.value;
  // mac info
  const digest_size = mac_digest_size.value;
  const key_size = mac_key_size.value;

  if (algorithm === 'HMAC') {
    mac.value = hmac(hash, digest_size, key_size);
  }
  else if (algorithm === 'KMAC128') {
    mac.value = kmac128(digest_size, customization, key_size);
  }
  else if (algorithm === 'KMAC128XOF') {
    mac.value = kmac128XOF(digest_size, customization, key_size);
  }
  else if (algorithm === 'KMAC256') {
    mac.value = kmac256(digest_size, customization, key_size);
  }
  else if (algorithm === 'KMAC256XOF') {
    mac.value = kmac256XOF(digest_size, customization, key_size);
  }
}));
</script>

<template>
  <div>
    <KitFormControl :title="title">
      <KitBaseFormSelect v-model="mac_alg" :options="mac_options" />
    </KitFormControl>
    <KitCollapse class="my-2 bg-base-300">
      <template #header>
        Mac Config
      </template>
      <template v-if="mac_alg === 'HMAC'">
        <KitDivider class="divider-start">
          # 1 Hash
        </KitDivider>
        <KitFormSelectHash
          v-model="mac_hash"
          title="Hash"
        />
      </template>
      <template v-else>
        <KitDivider class="divider-start">
          # 1 KMAC Config
        </KitDivider>
        <KitFormU8
          v-model="mac_custom"
          :codec="UTF8"
          title="Customization"
        />
      </template>
      <KitDivider class="divider-start">
        # 2 MAC Info
      </KitDivider>
      <KitFormNumber
        v-model="mac_digest_size"
        title="Digest Size (bit)"
      />
      <KitFormNumber
        v-model="mac_key_size"
        title="Key Size (bit)"
      />
    </KitCollapse>
  </div>
</template>
