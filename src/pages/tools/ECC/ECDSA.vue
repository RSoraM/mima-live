<script setup lang="ts">
import { FpECC, HEX, secp256r1, sha256, U8, UTF8 } from 'mima-kit';

const curve = ref(secp256r1);
const ec = computed(() => FpECC(curve.value));
const hash = ref(sha256);
const k = ref<ReturnType<typeof ec['value']['genKey']>>({
  d: 0n,
  Q: {
    isInfinity: true,
    x: 0n,
    y: 0n,
  },
});
const m = ref('mima-kit');
const m_codec = ref(UTF8);
const s = ref('');
const s_codec = ref(HEX);
const r = ref('');
const r_codec = ref(HEX);
function sign() {
  const dsa = ec.value.ecdsa(hash.value);
  const M = m_codec.value(m.value);
  const S = dsa.sign(k.value, M);
  r.value = U8.fromBI(S.r).to(r_codec.value);
  s.value = U8.fromBI(S.s).to(s_codec.value);
}
function verify() {
  const dsa = ec.value.ecdsa(hash.value);
  const M = m_codec.value(m.value);
  const R = r_codec.value(r.value).toBI();
  const S = s_codec.value(s.value).toBI();
  if (dsa.verify(k.value, M, { r: R, s: S })) {
    $notify({
      title: 'Verification',
      message: 'Verification success',
      type: 'success',
    });
  }
  else {
    $notify({
      title: 'Verification',
      message: 'Verification failed',
      type: 'error',
    });
  }
}

watch(
  curve,
  catchNotifySync(() => {
    s.value = '';
    r.value = '';
  }),
  { immediate: true },
);
onMounted(() => {
  sign();
});
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      ECDSA
    </h1>
    <KitFormCurveSelect v-model="curve" />
    <KitFormHashSelect v-model="hash" />
    <!-- Key Generation -->
    <KitFormECKey
      v-model="k"
      :curve="curve"
      :fold="true"
    />
    <!-- Signature -->
    <div class="divider my-8">
      <KitButton @click="sign()">
        sign
      </KitButton>/
      <KitButton @click="verify()">
        verify
      </KitButton>
    </div>
    <KitFormTextAreaWithCodec v-model:text="m" v-model:codec="m_codec" title="Message" />
    <KitFormInputWithCodec v-model:text="r" v-model:codec="r_codec" title="Signature r" />
    <KitFormInputWithCodec v-model:text="s" v-model:codec="s_codec" title="Signature s" />

    <!-- Curve Parameters -->
    <div class="divider my-8">
      Curve Parameters
    </div>
    <KitCurveTable :curve="curve" :codec="HEX" />
  </div>
</template>
