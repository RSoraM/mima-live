<script setup lang="ts">
import { bp192r1, bp224r1, bp256r1, bp320r1, bp384r1, bp512r1, secp192k1, secp192r1, secp224k1, secp224r1, secp256k1, secp256r1, secp384r1, secp521r1, sm2p256v1, w448, w25519 } from 'mima-kit';

defineOptions({ name: 'KitFormSelectCurve' });
defineProps<{ title?: string }>();
const curve = defineModel<typeof secp256r1>();
const curve_options: SelectOption[] = [
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
];
</script>

<template>
  <div class="flex gap-2">
    <KitFormControl :title="title || 'Curve'">
      <KitBaseFormSelect v-model="curve" :options="curve_options" />
    </KitFormControl>
  </div>
</template>
