<script setup lang="ts">
defineOptions({ name: 'KitFormSelectCurve' });

const {
  title = 'Curve',
  options: curve_options = [
    { label: 'sm2p256v1', value: sm2p256v1 },
    { label: 'secp192k1', value: secp192k1 },
    { label: 'secp192r1 / NIST P-192 / prime192v1', value: secp192r1 },
    { label: 'secp224k1', value: secp224k1 },
    { label: 'secp224r1 / NIST P-224', value: secp224r1 },
    { label: 'secp256k1', value: secp256k1 },
    { label: 'secp256r1 / NIST P-256 / prime256v1', value: secp256r1 },
    { label: 'secp384r1 / NIST P-384', value: secp384r1 },
    { label: 'secp521r1 / NIST P-521', value: secp521r1 },
    { label: 'NIST W-25519', value: w25519 },
    { label: 'NIST W-448', value: w448 },
    { label: 'RFC 5639 Brainpool 192r1', value: bp192r1 },
    { label: 'RFC 5639 Brainpool 224r1', value: bp224r1 },
    { label: 'RFC 5639 Brainpool 256r1', value: bp256r1 },
    { label: 'RFC 5639 Brainpool 320r1', value: bp320r1 },
    { label: 'RFC 5639 Brainpool 384r1', value: bp384r1 },
    { label: 'RFC 5639 Brainpool 512r1', value: bp512r1 },
    { label: 'Curve 25519', value: curve25519 },
    { label: 'Curve 448', value: curve448 },
  ],
} = defineProps<{
  title?: string;
  options?: SelectOption[];
}>();
const curve = defineModel<typeof secp256r1 | typeof curve25519>();
</script>

<template>
  <KitFormSelect
    v-model="curve"
    :options="curve_options"
    :title="title"
  />
</template>
