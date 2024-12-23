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

// BLOCK CIPHER
const cipher_alg = ref('SM4');
const cipher_iv = ref(new U8());
const cipher_mode = ref(cbc);
const cipher_padding = ref(PKCS7_PAD);
const cipher_disable_no_padding = ref(true);
const cipher_option: SelectOption[] = [
  { label: 'SM4', value: 'SM4' },
  { label: 'AES', value: 'AES' },
  { label: 'ARIA', value: 'ARIA' },
  { label: 'Camellia', value: 'Camellia' },
  { label: 'DES', value: 'DES' },
  { label: '3DES', value: '3DES' },
  { label: 'ARC5', value: 'ARC5' },
  { label: 'Blowfish', value: 'Blowfish' },
  { label: 'Twofish', value: 'Twofish' },
  { label: 'TEA', value: 'TEA' },
  { label: 'XTEA', value: 'XTEA' },
];
const cipher_key_size = ref<128 | 192 | 256>(128);
const cipher_key_size_option = computed<SelectOption[]>(() => ([
  { label: '128', value: 128 },
  { label: '192', value: 192 },
  { label: '256', value: 256, disable: cipher_alg.value === '3DES' },
]));
const show_chipher_key_size_option = computed(() => [
  'AES',
  'ARIA',
  'Camellia',
  '3DES',
  'Twofish',
].includes(cipher_alg.value));
const cipher_arc5_r = ref(20);
const cipher_arc5_ws = ref<8 | 16 | 32 | 64 | 128>(64);
const cipher_arc5_ws_option: SelectOption[] = [
  { label: '8', value: 8 },
  { label: '16', value: 16 },
  { label: '32', value: 32 },
  { label: '64', value: 64 },
  { label: '128', value: 128 },
];
const cipher_tea_r = ref(32);
const show_cipher_tea_r = computed(() => ['TEA', 'XTEA'].includes(cipher_alg.value));
const block_cipher = computed(() => {
  if (cipher_alg.value === 'SM4') {
    return sm4;
  }
  else if (cipher_alg.value === 'AES') {
    return aes(cipher_key_size.value);
  }
  else if (cipher_alg.value === 'ARIA') {
    return aria(cipher_key_size.value);
  }
  else if (cipher_alg.value === 'Camellia') {
    return camellia(cipher_key_size.value);
  }
  else if (cipher_alg.value === 'DES') {
    return des;
  }
  else if (cipher_alg.value === '3DES') {
    return t_des(cipher_key_size.value as 128 | 192);
  }
  else if (cipher_alg.value === 'ARC5') {
    return arc5(cipher_arc5_ws.value, cipher_arc5_r.value);
  }
  else if (cipher_alg.value === 'Blowfish') {
    return blowfish;
  }
  else if (cipher_alg.value === 'Twofish') {
    return twofish(cipher_key_size.value);
  }
  else if (cipher_alg.value === 'TEA') {
    return tea(cipher_tea_r.value);
  }
  else if (cipher_alg.value === 'XTEA') {
    return xtea(cipher_tea_r.value);
  }

  return undefined;
});
const cipher = computed(
  () => block_cipher.value
    ? cipher_mode.value(block_cipher.value, cipher_padding.value)
    : undefined,
);

// MAC
const mac_alg = ref('HMAC');
const mac_hash = ref(sha256);
const mac_d = ref(sha256.DIGEST_SIZE);
const mac_k = ref(sha256.DIGEST_SIZE);
const mac_s = ref(new U8());
const mac_option: SelectOption[] = [
  { label: 'HMAC', value: 'HMAC' },
  { label: 'KMAC128', value: 'KMAC128' },
  { label: 'KMAC128XOF', value: 'KMAC128XOF' },
  { label: 'KMAC256', value: 'KMAC256' },
  { label: 'KMAC256XOF', value: 'KMAC256XOF' },
];
watch(mac_alg, () => {
  if (mac_alg.value === 'HMAC') {
    mac_d.value = mac_hash.value.DIGEST_SIZE;
  }
  else if (mac_alg.value === 'KMAC128' || mac_alg.value === 'KMAC128XOF') {
    mac_k.value = 128;
    mac_d.value = 256;
  }
  else {
    mac_k.value = 256;
    mac_d.value = 512;
  }
});
watch(mac_hash, () => {
  mac_d.value = mac_hash.value.DIGEST_SIZE;
  mac_k.value = mac_hash.value.DIGEST_SIZE;
});
function createMac(alg: string, S: Uint8Array, d: number, k: number) {
  if (alg === 'HMAC') {
    return hmac(mac_hash.value, d, k);
  }
  else if (alg === 'KMAC128') {
    return kmac128(d, S, k);
  }
  else if (alg === 'KMAC128XOF') {
    return kmac128XOF(d, S, k);
  }
  else if (alg === 'KMAC256') {
    return kmac256(d, S, k);
  }
  else if (alg === 'KMAC256XOF') {
    return kmac256XOF(d, S, k);
  }
  return undefined;
}
const mac = computed(() => {
  const S = mac_s.value;
  return createMac(mac_alg.value, S, mac_d.value, mac_k.value);
});

// KDF
const kdf_alg = ref('ANSI X9.63');
const kdf_option: SelectOption[] = [
  { label: 'ANSI X9.63', value: 'ANSI X9.63' },
  { label: 'HKDF', value: 'HKDF' },
  { label: 'PBKDF2', value: 'PBKDF2' },
];
const kdf_hash = ref(sha256);
const kdf_mac_alg = ref('HMAC');
const kdf_mac_hash = ref(sha256);
const kdf_mac_s = ref(new U8());
const kdf_mac_d = ref(sha256.DIGEST_SIZE);
const kdf_mac_k = ref(sha256.DIGEST_SIZE);
const kdf_salt = ref(new U8());
const kdf_iterations = ref(5000);
watch(kdf_mac_alg, () => {
  if (kdf_mac_alg.value === 'HMAC') {
    kdf_mac_d.value = mac_hash.value.DIGEST_SIZE;
  }
  else if (kdf_mac_alg.value === 'KMAC128' || kdf_mac_alg.value === 'KMAC128XOF') {
    kdf_mac_k.value = 128;
    kdf_mac_d.value = 256;
  }
  else {
    kdf_mac_k.value = 256;
    kdf_mac_d.value = 512;
  }
});
watch(kdf_mac_hash, () => {
  kdf_mac_d.value = kdf_mac_hash.value.DIGEST_SIZE;
  kdf_mac_k.value = kdf_mac_hash.value.DIGEST_SIZE;
});
const kdf = computed(() => {
  const S = kdf_salt.value;
  const MS = kdf_mac_s.value;
  if (kdf_alg.value === 'ANSI X9.63') {
    return x963kdf(kdf_hash.value);
  }
  else if (kdf_alg.value === 'HKDF') {
    const mac = createMac(kdf_mac_alg.value, MS, kdf_mac_d.value, kdf_mac_k.value);
    return mac ? hkdf(mac, S) : undefined;
  }
  else if (kdf_alg.value === 'PBKDF2') {
    const mac = createMac(kdf_mac_alg.value, MS, kdf_mac_d.value, kdf_mac_k.value);
    return mac ? pbkdf2(mac, S, kdf_iterations.value) : undefined;
  }
  return undefined;
});

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
  <div>
    <h1 class="mx-auto text-4xl font-bold md:my-8">
      ECIES
    </h1>
    <KitFormCurveSelect v-model="curve" />
    <div class="divider my-8">
      Components Config
    </div>
    <!-- Key Generation -->
    <KitCollapse class="bg-base-200" open>
      <template #header>
        Key Generation
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
      <KitFormControl title="Cipher">
        <KitBaseFormSelect v-model="cipher_alg" :options="cipher_option" />
      </KitFormControl>
      <KitFormControl v-show="show_chipher_key_size_option" title="Key Size">
        <KitBaseFormSelect v-model="cipher_key_size" :options="cipher_key_size_option" />
      </KitFormControl>
      <div v-show="cipher_alg === 'ARC5'" class="flex gap-2">
        <KitFormControl title="Word Size (byte)">
          <KitBaseFormSelect v-model="cipher_arc5_ws" :options="cipher_arc5_ws_option" />
        </KitFormControl>
        <KitFormInput v-model="cipher_arc5_r" title="Rounds" type="number" />
      </div>
      <KitFormInput v-show="show_cipher_tea_r" v-model="cipher_tea_r" title="Rounds" type="number" />
      <!-- Mode Config -->
      <div class="divider my-8">
        Operation Mode Config
      </div>
      <div class="flex gap-2">
        <KitFormModeSelect v-model="cipher_mode" :blocksize="block_cipher?.BLOCK_SIZE" />
        <KitFormPaddingSelect v-model:padding="cipher_padding" v-model:disable-no-pad="cipher_disable_no_padding" />
      </div>
      <KitFormU8
        v-if="cipher_mode !== ecb"
        v-model:buffer="cipher_iv"
        :codec="UTF8"
        title="IV"
      />
    </KitCollapse>
    <!-- Mac Config -->
    <KitCollapse class="mt-4 bg-base-200">
      <template #header>
        Mac
      </template>
      <KitFormControl title="Mac">
        <KitBaseFormSelect v-model="mac_alg" :options="mac_option" />
      </KitFormControl>
      <KitFormHashSelect v-if="mac_alg === 'HMAC'" v-model="mac_hash" title="Mac-Hash" />
      <KitFormU8
        v-else
        v-model:buffer="mac_s"
        :codec="UTF8"
        title="Customization"
      />
      <KitFormInput v-model="mac_d" title="Digest Size (byte)" type="number" />
      <KitFormInput v-model="mac_k" title="Key Size (byte)" type="number" />
    </KitCollapse>
    <!-- KDF -->
    <KitCollapse class="mt-4 bg-base-200">
      <template #header>
        KDF
      </template>
      <KitFormControl title="KDF">
        <KitBaseFormSelect v-model="kdf_alg" :options="kdf_option" />
      </KitFormControl>
      <div v-if="kdf_alg === 'ANSI X9.63'">
        <KitFormHashSelect v-model="kdf_hash" />
      </div>
      <div v-else>
        <KitFormU8
          v-model:buffer="kdf_salt"
          :codec="UTF8"
          title="Salt"
        />
        <KitFormControl title="KDF-Mac">
          <KitBaseFormSelect v-model="kdf_mac_alg" :options="mac_option" />
        </KitFormControl>
        <KitFormHashSelect v-if="kdf_mac_alg === 'HMAC'" v-model="kdf_mac_hash" title="KDF-Mac-Hash" />
        <KitFormU8
          v-else
          v-model:buffer="kdf_mac_s"
          title="Customization"
        />
        <KitFormInput v-model="kdf_mac_d" title="Digest Size (byte)" type="number" />
        <KitFormInput v-model="kdf_mac_k" title="Key Size (byte)" type="number" />
      </div>
      <KitFormInput v-if="kdf_alg === 'PBKDF2'" v-model="kdf_iterations" title="Iterations" type="number" />
    </KitCollapse>
    <!-- Additional Data -->
    <KitCollapse class="mt-4 bg-base-200">
      <template #header>
        Additional Data
      </template>
      <KitFormU8
        v-model:buffer="S1"
        :codec="UTF8"
        title="S1"
      />
      <KitFormU8
        v-model:buffer="S2"
        :codec="UTF8"
        title="S2"
      />
    </KitCollapse>
    <!-- Encryption -->
    <div class="divider my-8">
      <KitButton @click="encrypt()">
        Encrypt
      </KitButton>/
      <KitButton @click="decrypt()">
        Decrypt
      </KitButton>
    </div>
    <KitFormU8
      v-model:buffer="M"
      :codec="UTF8"
      title="Plaintext"
      textarea
    />
    <KitFormU8
      v-model:buffer="C"
      :codec="HEX"
      title="Ciphertext"
      textarea
    />
    <KitFormU8
      v-model:buffer="D"
      :codec="HEX"
      title="Tag"
    />
    <KitFormECPointCompress
      v-model="r"
      :curve="curve"
      :fold="true"
      title="R"
    />

    <!-- Curve Parameters -->
    <div class="divider my-8">
      Curve Parameters
    </div>
    <KitCurveTable :curve="curve" :codec="HEX" />
  </div>
</template>
