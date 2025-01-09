<script setup lang="ts">
defineOptions({ name: 'ECIES' });

const key = useECCKey();
const { curve } = storeToRefs(key);
const ec = computed(() => FpECC(curve.value));

// ENCRYPTION
const M = ref(UTF8('mima-kit'));
const C = ref(new U8());
const D = ref(new U8());
const r = ref({
  d: new U8(),
  Q: U8Point(),
});

// CIPHER
const cipher_alg = ref(sm4);
const cipher = ref(cbc(sm4));

// MAC
const mac = ref(hmac(sha256));

// KDF
const kdf = ref(x963kdf(sha256));

// ECIES
const iv = ref(new U8());
const S1 = ref(new U8());
const S2 = ref(new U8());
const encrypt = catchNotifySync(() => {
  if (!(cipher.value || mac.value || kdf.value)) {
    return;
  }
  const ecies = ec.value.ies({
    cipher: cipher.value,
    mac: mac.value,
    kdf: kdf.value,
    S1: S1.value,
    S2: S2.value,
    iv: iv.value.length ? iv.value : undefined,
  });
  const ciphertext = ecies.encrypt(key, M.value);
  C.value = U8.from(ciphertext.C);
  D.value = U8.from(ciphertext.D);
  r.value = {
    d: new U8(),
    Q: U8Point(ciphertext.R.Q),
  };
});
const decrypt = catchNotifySync(() => {
  if (!(cipher.value || mac.value || kdf.value)) {
    return;
  }
  const ecies = ec.value.ies({
    cipher: cipher.value,
    mac: mac.value,
    kdf: kdf.value,
    S1: S1.value,
    S2: S2.value,
    iv: iv.value.length ? iv.value : undefined,
  });
  const ciphertext = {
    C: C.value,
    D: D.value,
    R: { Q: U8Point(r.value.Q) },
  };
  M.value = ecies.decrypt(key, ciphertext);
});

onMounted(() => nextTick(() => {
  key.gen();
  encrypt();
}));
</script>

<template>
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    ECIES
  </h1>
  <KitStep num="0" title="Choose Curve">
    <KitFormSelectCurve v-model="curve" title="" class="w-full" />
  </KitStep>
  <KitStep num="1" title="Key Generation">
    <KitFormU8 v-model="key.d" :codec="HEX" :title="`Private Key dA (${key.d_bit} bit)`" />
    <KitFormECCPoint
      v-model="key.Q" :curve="curve"
      :x-bit="key.x_bit" :y-bit="key.y_bit"
      name="Public Key QA"
    />
    <template #action>
      <KitButton @click="key.$reset()">
        Clear
      </KitButton>
      <KitButton @click="key.gen()">
        Generate
      </KitButton>
    </template>
  </KitStep>
  <KitStep num="3" title="Components Config">
    <KitFoldCard title="Block Cipher">
      <KitFormSelectBlockCipher v-model="cipher_alg" class="w-full" />
      <KitFormModeConfig v-model="cipher" :block-cipher="cipher_alg" />
    </KitFoldCard>
    <KitFoldCard title="MAC Algorithm" class="mt-2">
      <KitFormSelectMAC v-model="mac" class="w-full" />
    </KitFoldCard>
    <KitFoldCard title="KDF Algorithm" class="mt-2">
      <KitFormSelectKDF v-model="kdf" class="w-full" />
    </KitFoldCard>
    <KitFoldCard title="Additional Data" class="mt-2">
      <KitFormU8
        v-model="S1" :codec="UTF8"
        title="S1"
      />
      <KitFormU8
        v-model="S2" :codec="UTF8"
        title="S2"
      />
      <KitFormU8
        v-if="!cipher.ALGORITHM.startsWith('ECB')"
        v-model="iv" :codec="UTF8"
        title="IV"
      />
    </KitFoldCard>
  </KitStep>
  <KitStep num="4" title="Encryption">
    <template #action-top>
      <KitButton @click="decrypt()">
        Decrypt
      </KitButton>
      <KitButton @click="encrypt()">
        Encrypt
      </KitButton>
    </template>
    <KitFormU8
      v-model="M" :codec="UTF8"
      title="Plaintext"
      textarea
    />
    <KitFormU8
      v-model="C" :codec="HEX"
      title="Ciphertext"
      textarea
    />
    <KitFormU8
      v-model="D" :codec="HEX"
      title="Tag"
    />
    <KitFoldCard open class="mt-2">
      <template #header>
        One-Time Public Key R
      </template>
      <KitFormECCPoint
        v-model="r.Q" :curve="curve"
        name="R"
      />
    </KitFoldCard>
  </KitStep>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
