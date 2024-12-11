<script setup lang="ts">
import { FpECC, HEX, secp256r1, sha256, U8, UTF8 } from 'mima-kit';

// TODO 样式一致性！isSignAble

interface ECCKeypair {
  d: string;
  Q: {
    isInfinity: boolean;
    x: string;
    y: string;
  };
}

const curve = ref(secp256r1);
const ec = computed(() => FpECC(curve.value));
const hash = ref(sha256);
const k_codec = ref(HEX);
const k = ref<ECCKeypair>({
  d: '',
  Q: {
    isInfinity: true,
    x: '',
    y: '',
  },
});
const k_raw = computed(() => {
  return {
    d: k_codec.value(k.value.d).toBI(),
    Q: {
      isInfinity: k.value.Q.isInfinity,
      x: k_codec.value(k.value.Q.x).toBI(),
      y: k_codec.value(k.value.Q.y).toBI(),
    },
  };
});
const k_bits = computed(() => {
  const d = k_raw.value.d;
  const isInfinity = k.value.Q.isInfinity;
  const Qx = k_raw.value.Q.x;
  const Qy = k_raw.value.Q.y;
  return {
    d: d ? d.toString(2).length : 0,
    Q: {
      isInfinity,
      x: Qx ? Qx.toString(2).length : 0,
      y: Qy ? Qy.toString(2).length : 0,
    },
  };
});
const m = ref('mima-kit');
const m_codec = ref(UTF8);
const s = ref('');
const s_codec = ref(HEX);
const r = ref('');
const r_codec = ref(HEX);
function genKey() {
  clearKey();
  const now = performance.now();
  const keypair = ec.value.genKey();
  const end = performance.now();
  k.value = {
    d: k_codec.value(U8.fromBI(keypair.d)),
    Q: {
      isInfinity: keypair.Q.isInfinity || false,
      x: k_codec.value(U8.fromBI(keypair.Q.x)),
      y: k_codec.value(U8.fromBI(keypair.Q.y)),
    },
  };
  $notify({
    title: 'Key generated',
    message: `Time: ${(end - now).toFixed(2)} ms`,
    type: 'success',
  });
}
function clearKey() {
  s.value = '';
  r.value = '';
  k.value = {
    d: '',
    Q: {
      isInfinity: true,
      x: '',
      y: '',
    },
  };
}
function sign() {
  const dsa = ec.value.ecdsa(hash.value);
  const M = m_codec.value(m.value);
  const S = dsa.sign(k_raw.value, M);
  r.value = r_codec.value(U8.fromBI(S.r));
  s.value = s_codec.value(U8.fromBI(S.s));
}
function verify() {
  const dsa = ec.value.ecdsa(hash.value);
  const M = m_codec.value(m.value);
  const R = r_codec.value(r.value).toBI();
  const S = s_codec.value(s.value).toBI();
  if (dsa.verify(k_raw.value, M, { r: R, s: S })) {
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
watch(k_codec, (new_codec, old_codec) => {
  k.value = {
    d: new_codec(old_codec(k.value.d)),
    Q: {
      isInfinity: k.value.Q.isInfinity,
      x: new_codec(old_codec(k.value.Q.x)),
      y: new_codec(old_codec(k.value.Q.y)),
    },
  };
});
watch(curve, () => {
  clearKey();
});

genKey();
sign();
</script>

<template>
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      ECDSA
    </h1>
    <KitFormCurveSelect v-model="curve" />
    <KitFormHashSelect v-model="hash" />
    <!-- Key Generation -->
    <div class="divider my-8">
      <button class="btn btn-outline btn-sm" @click="clearKey()">
        Clear
      </button>/
      <button class="btn btn-outline btn-sm" @click="genKey()">
        Generate
      </button>
    </div>
    <KitFormControl title="Key Codec">
      <KitBaseFormCodecSelect v-model="k_codec" />
    </KitFormControl>
    <KitFormInput v-model="k.d" :title="`Private key dA: (${k_bits.d} bit)`" />
    <KitFormInput v-model="k.Q.x" :title="`Public key QA.x: (${k_bits.Q.x} bit)`" />
    <KitFormInput v-model="k.Q.y" :title="`Public key QA.y: (${k_bits.Q.y} bit)`" />
    <!-- Signature -->
    <div class="divider my-8">
      <button class="btn btn-outline btn-sm" @click="sign()">
        sign
      </button>/
      <button class="btn btn-outline btn-sm" @click="verify()">
        verify
      </button>
    </div>
    <KitFormTextAreaWithCodec v-model:text="m" v-model:codec="m_codec" title="Message" />
    <KitFormInputWithCodec v-model:text="r" v-model:codec="r_codec" title="Signature r" />
    <KitFormInputWithCodec v-model:text="s" v-model:codec="s_codec" title="Signature s" />

    <!-- Curve Parameters -->
    <div class="divider my-8">
      Curve Parameters
    </div>
    <KitCurveTable :curve="curve" :codec="k_codec" />
  </div>
</template>
