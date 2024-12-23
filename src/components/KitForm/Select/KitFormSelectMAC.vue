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

const mac_alg = ref('HMAC');
const mac_hash = ref(sha256);
const mac_d = ref(mac_hash.value.DIGEST_SIZE);
const mac_k = ref(mac_hash.value.DIGEST_SIZE);
const mac_s = ref(new U8());
const mac = defineModel<ReturnType<typeof hmac>>({ required: true });

watchImmediate(mac_alg, () => {
  if (mac_alg.value === 'HMAC') {
    mac_d.value = mac_hash.value.DIGEST_SIZE;
  }
  else if (mac_alg.value === 'KMAC128' || mac_alg.value === 'KMAC128XOF') {
    mac_k.value = 128;
    mac_d.value = 256;
  }
  else if (mac_alg.value === 'KMAC256' || mac_alg.value === 'KMAC256XOF') {
    mac_k.value = 256;
    mac_d.value = 512;
  }
});
watchImmediate(mac_hash, () => {
  mac_d.value = mac_hash.value.DIGEST_SIZE;
  mac_k.value = mac_hash.value.DIGEST_SIZE;
});

watchEffect(catchNotifySync(() => {
  const alg = mac_alg.value;
  const d = mac_d.value;
  const k = mac_k.value;
  const S = mac_s.value;
  if (alg === 'HMAC') {
    mac.value = hmac(mac_hash.value, d, k);
  }
  else if (alg === 'KMAC128') {
    mac.value = kmac128(d, S, k);
  }
  else if (alg === 'KMAC128XOF') {
    mac.value = kmac128XOF(d, S, k);
  }
  else if (alg === 'KMAC256') {
    mac.value = kmac256(d, S, k);
  }
  else if (alg === 'KMAC256XOF') {
    mac.value = kmac256XOF(d, S, k);
  }
}));
</script>

<template>
  <div>
    <KitFormControl :title="title">
      <KitBaseFormSelect v-model="mac_alg" :options="mac_options" />
    </KitFormControl>
    <KitFormSelectHash
      v-if="mac_alg === 'HMAC'"
      v-model="mac_hash"
      :title="`${title} Hash`"
    />
    <KitFormU8
      v-else
      v-model="mac_s"
      :codec="UTF8"
      title="Customization"
    />
    <KitFormNumber v-model="mac_d" title="Digest Size (byte)" />
    <KitFormNumber v-model="mac_k" title="Key Size (byte)" />
  </div>
</template>
