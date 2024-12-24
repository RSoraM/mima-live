<script setup lang="ts">
defineOptions({ name: 'ECIES' });

const curve = ref(secp256r1);
const ec = computed(() => FpECC(curve.value));

// KEY
const key = ref({
  d: 0n,
  Q: {
    isInfinity: true,
    x: 0n,
    y: 0n,
  },
});
// ENCRYPTION
const M = ref(UTF8('mima-kit'));
const C = ref(new U8());
const D = ref(new U8());
const r = ref({
  d: 0n,
  Q: {
    isInfinity: true,
    x: 0n,
    y: 0n,
  },
});

// CIPHER
const cipher_iv = ref(new U8());
const cipher_alg = ref(sm4);
const cipher_mode = ref(cbc);
const cipher_padding = ref(PKCS7_PAD);
const cipher = computed(() => cipher_mode.value(cipher_alg.value, cipher_padding.value));

// MAC
const mac = ref(hmac(sha256));

// KDF
const kdf = ref(x963kdf(sha256));

// ECIES
const S1 = ref(new U8());
const S2 = ref(new U8());
const encrypt = catchNotifySync(() => {
  if (!(cipher.value || mac.value || kdf.value)) {
    return;
  }
  const iv = cipher_iv.value.length ? cipher_iv.value : undefined;
  const ecies = ec.value.ecies({
    cipher: cipher.value,
    mac: mac.value,
    kdf: kdf.value,
    S1: S1.value,
    S2: S2.value,
    iv,
  });
  const ciphertext = ecies.encrypt(key.value, M.value);
  C.value = U8.from(ciphertext.C);
  D.value = U8.from(ciphertext.D);
  r.value = {
    d: 0n,
    Q: {
      isInfinity: ciphertext.R.Q.isInfinity || false,
      x: ciphertext.R.Q.x,
      y: ciphertext.R.Q.y,
    },
  };
});
const decrypt = catchNotifySync(() => {
  if (!(cipher.value || mac.value || kdf.value)) {
    return;
  }
  const iv = cipher_iv.value.length ? cipher_iv.value : undefined;
  const ecies = ec.value.ecies({
    cipher: cipher.value,
    mac: mac.value,
    kdf: kdf.value,
    S1: S1.value,
    S2: S2.value,
    iv,
  });
  const ciphertext = {
    C: C.value,
    D: D.value,
    R: {
      Q: {
        isInfinity: r.value.Q.isInfinity,
        x: r.value.Q.x,
        y: r.value.Q.y,
      },
    },
  };
  M.value = ecies.decrypt(key.value, ciphertext);
});

onMounted(() => nextTick(() => encrypt()));
</script>

<template>
  <h1 class="mx-auto text-4xl font-bold md:my-8">
    ECIES
  </h1>
  <KitFormSelectCurve v-model="curve" />
  <KitDivider>
    Components Config
  </KitDivider>
  <!-- Key Generation -->
  <KitCollapse class="bg-base-200" open>
    <template #header>
      Key
    </template>
    <KitFormECKey
      v-model="key"
      :curve="curve"
      :fold="true"
    />
  </KitCollapse>
  <!-- Cipher Config -->
  <KitCollapse class="mt-4 bg-base-200">
    <template #header>
      Cipher
    </template>
    <KitFormSelectBlockCipher
      v-model="cipher_alg"
      title="Cipher"
    />
    <!-- Mode Config -->
    <KitDivider>
      Operation Mode Config
    </KitDivider>
    <div class="flex flex-col md:flex-row md:gap-2">
      <KitFormSelectMode
        v-model="cipher_mode"
        :blocksize="cipher_alg.BLOCK_SIZE"
        title="Mode"
      />
      <KitFormSelectPadding
        v-model="cipher_padding"
        :mode="cipher_mode"
        title="Padding"
      />
    </div>
  </KitCollapse>
  <!-- Mac Config -->
  <KitCollapse class="mt-4 bg-base-200">
    <template #header>
      Mac
    </template>
    <KitFormSelectMAC v-model="mac" title="Mac" />
  </KitCollapse>
  <!-- KDF -->
  <KitCollapse class="mt-4 bg-base-200">
    <template #header>
      KDF
    </template>
    <KitFormSelectKDF v-model="kdf" title="KDF" />
  </KitCollapse>
  <!-- Additional Data -->
  <KitCollapse class="mt-4 bg-base-200">
    <template #header>
      Additional Data
    </template>
    <KitFormU8
      v-model="S1"
      :codec="UTF8"
      title="S1"
    />
    <KitFormU8
      v-model="S2"
      :codec="UTF8"
      title="S2"
    />
    <KitFormU8
      v-if="cipher_mode !== ecb"
      v-model="cipher_iv"
      :codec="UTF8"
      title="IV"
    />
  </KitCollapse>
  <!-- Encryption -->
  <KitDivider>
    <KitButton @click="encrypt()">
      Encrypt
    </KitButton>/
    <KitButton @click="decrypt()">
      Decrypt
    </KitButton>
  </KitDivider>
  <KitFormU8
    v-model="M"
    :codec="UTF8"
    title="Plaintext"
    textarea
  />
  <KitFormU8
    v-model="C"
    :codec="HEX"
    title="Ciphertext"
    textarea
  />
  <KitFormU8
    v-model="D"
    :codec="HEX"
    title="Tag"
  />
  <KitDivider class="divider-start">
    One-Time Public Key R
  </KitDivider>
  <KitFormECKey
    v-model="r"
    :curve="curve"
    :fold="true"
    :point-only="true"
    name="R"
  />

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
