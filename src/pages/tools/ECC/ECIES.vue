<script setup lang="ts">
import { aes, arc5, aria, blowfish, camellia, cbc, des, ecb, FpECC, HEX, hkdf, hmac, kmac128, kmac128XOF, kmac256, kmac256XOF, pbkdf2, PKCS7_PAD, secp256r1, sha256, sm4, t_des, tea, twofish, U8, UTF8, x963kdf, xtea } from 'mima-kit';

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

// KEY
const codec = ref(HEX);
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
    d: codec.value(k.value.d).toBI(),
    Q: {
      isInfinity: k.value.Q.isInfinity,
      x: codec.value(k.value.Q.x).toBI(),
      y: codec.value(k.value.Q.y).toBI(),
    },
  };
});
// ENCRYPTION
const m = ref('mima-kit');
const m_codec = ref(UTF8);
const c = ref('');
const c_codec = ref(HEX);
const d = ref('');
const d_codec = ref(HEX);
const r = ref<ECCKeypair['Q']>({
  isInfinity: true,
  x: '',
  y: '',
});
const r_raw = computed(() => ({
  isInfinity: r.value.isInfinity,
  x: codec.value(r.value.x).toBI(),
  y: codec.value(r.value.y).toBI(),
}));

// KEY GENERATION
function genKey() {
  clearKey();
  const ec = FpECC(curve.value);
  const keypair = ec.genKey();
  k.value = {
    d: U8.fromBI(keypair.d).to(codec.value),
    Q: {
      isInfinity: keypair.Q.isInfinity || false,
      x: U8.fromBI(keypair.Q.x).to(codec.value),
      y: U8.fromBI(keypair.Q.y).to(codec.value),
    },
  };
}
function clearKey() {
  c.value = '';
  k.value = {
    d: '',
    Q: {
      isInfinity: true,
      x: '',
      y: '',
    },
  };
}

// BLOCK CIPHER
const cipher_alg = ref('SM4');
const cipher_iv = ref('');
const cipher_iv_codec = ref(HEX);
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
const mac_s = ref('');
const mac_s_codec = ref(UTF8);
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
  const S = mac_s_codec.value(mac_s.value);
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
const kdf_mac_s = ref('');
const kdf_mac_s_codec = ref(UTF8);
const kdf_mac_d = ref(sha256.DIGEST_SIZE);
const kdf_mac_k = ref(sha256.DIGEST_SIZE);
const kdf_salt = ref('');
const kdf_salt_codec = ref(UTF8);
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
  const S = kdf_salt_codec.value(kdf_salt.value);
  const MS = kdf_mac_s_codec.value(kdf_mac_s.value);
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
const s1 = ref('');
const s1_codec = ref(UTF8);
const s2 = ref('');
const s2_codec = ref(UTF8);
function encrypt() {
  if (!(cipher.value && mac.value && kdf.value)) {
    return;
  }
  const S1 = s1_codec.value(s1.value);
  const S2 = s2_codec.value(s2.value);
  const iv = cipher_iv.value ? cipher_iv_codec.value(cipher_iv.value) : undefined;
  const ecies = ec.value.ecies({
    cipher: cipher.value,
    mac: mac.value,
    kdf: kdf.value,
    S1,
    S2,
    iv,
  });
  const { C, R, D } = ecies.encrypt(k_raw.value, m_codec.value(m.value));
  c.value = c_codec.value(C);
  d.value = d_codec.value(D);
  r.value = {
    isInfinity: R.Q.isInfinity || false,
    x: U8.fromBI(R.Q.x).to(codec.value),
    y: U8.fromBI(R.Q.y).to(codec.value),
  };
}
function decrypt() {
  if (!(cipher.value && mac.value && kdf.value)) {
    return;
  }
  const S1 = s1_codec.value(s1.value);
  const S2 = s2_codec.value(s2.value);
  const iv = cipher_iv.value ? cipher_iv_codec.value(cipher_iv.value) : undefined;
  const ecies = ec.value.ecies({
    cipher: cipher.value,
    mac: mac.value,
    kdf: kdf.value,
    S1,
    S2,
    iv,
  });
  const C = {
    C: c_codec.value(c.value),
    D: d_codec.value(d.value),
    R: {
      Q: r_raw.value,
    },
  };
  const P = ecies.decrypt(k_raw.value, C);
  m.value = m_codec.value(P);
}
watch(codec, (new_codec, old_codec) => {
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
encrypt();
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
    <details class="collapse collapse-plus bg-base-200" open>
      <summary class="collapse-title text-lg font-bold">
        Key Generation
      </summary>
      <div class="collapse-content pt-4">
        <KitFormControl title="Key Codec">
          <KitBaseFormCodecSelect v-model="codec" />
        </KitFormControl>
        <div class="divider my-8">
          <button class="btn btn-outline btn-sm" @click="clearKey()">
            Clear
          </button>/
          <button class="btn btn-outline btn-sm" @click="genKey()">
            Generate
          </button>
        </div>
        <KitFormInput v-model="k.d" :title="`Private Key d: (${getBIBits(k_raw.d)} bit)`" />
        <KitFormPointCompress
          v-model:curve="curve"
          v-model:p="k.Q"
          v-model:codec="codec"
          title="Public Key Q"
        />
      </div>
    </details>
    <!-- Cipher Config -->
    <details class="collapse collapse-plus mt-4 bg-base-200">
      <summary class="collapse-title text-lg font-bold">
        Cipher
      </summary>
      <div class="collapse-content pt-4">
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
        <KitFormInputWithCodec v-show="cipher_mode !== ecb" v-model:text="cipher_iv" v-model:codec="cipher_iv_codec" title="iv" />
      </div>
    </details>
    <!-- Mac Config -->
    <details class="collapse collapse-plus mt-4 bg-base-200">
      <summary class="collapse-title text-lg font-bold">
        Mac
      </summary>
      <div class="collapse-content pt-4">
        <KitFormControl title="Mac">
          <KitBaseFormSelect v-model="mac_alg" :options="mac_option" />
        </KitFormControl>
        <KitFormHashSelect v-if="mac_alg === 'HMAC'" v-model="mac_hash" title="Mac-Hash" />
        <KitFormInputWithCodec v-else v-model:text="mac_s" v-model:codec="mac_s_codec" title="Customization" />
        <KitFormInput v-model="mac_d" title="Digest Size (byte)" />
        <KitFormInput v-model="mac_k" title="Key Size (byte)" />
      </div>
    </details>
    <!-- KDF -->
    <details class="collapse collapse-plus mt-4 bg-base-200">
      <summary class="collapse-title text-lg font-bold">
        KDF
      </summary>
      <div class="collapse-content pt-4">
        <KitFormControl title="KDF">
          <KitBaseFormSelect v-model="kdf_alg" :options="kdf_option" />
        </KitFormControl>
        <div v-if="kdf_alg === 'ANSI X9.63'">
          <KitFormHashSelect v-model="kdf_hash" />
        </div>
        <div v-else>
          <KitFormInputWithCodec v-model="kdf_salt" v-model:codec="kdf_salt_codec" title="Salt" />
          <KitFormControl title="KDF-Mac">
            <KitBaseFormSelect v-model="kdf_mac_alg" :options="mac_option" />
          </KitFormControl>
          <KitFormHashSelect v-if="kdf_mac_alg === 'HMAC'" v-model="kdf_mac_hash" title="KDF-Mac-Hash" />
          <KitFormInputWithCodec v-else v-model:text="kdf_mac_s" v-model:codec="kdf_mac_s_codec" title="Customization" />
          <KitFormInput v-model="kdf_mac_d" title="Digest Size (byte)" />
          <KitFormInput v-model="kdf_mac_k" title="Key Size (byte)" />
        </div>
        <KitFormInput v-if="kdf_alg === 'PBKDF2'" v-model="kdf_iterations" title="Iterations" type="number" />
      </div>
    </details>
    <!-- Additional Data -->
    <details class="collapse collapse-plus mt-4 bg-base-200">
      <summary class="collapse-title text-lg font-bold">
        Additional Data
      </summary>
      <div class="collapse-content pt-4">
        <KitFormInputWithCodec v-model:text="s1" v-model:codec="s1_codec" title="S1" />
        <KitFormInputWithCodec v-model:text="s2" v-model:codec="s2_codec" title="S2" />
      </div>
    </details>
    <!-- Encryption -->
    <div class="divider my-8">
      <button class="btn btn-outline btn-sm" @click="encrypt()">
        Encrypt
      </button>/
      <button class="btn btn-outline btn-sm" @click="decrypt()">
        Decrypt
      </button>
    </div>
    <KitFormTextAreaWithCodec v-model:text="m" v-model:codec="m_codec" title="Plaintext" />
    <KitFormTextAreaWithCodec v-model:text="c" v-model:codec="c_codec" title="Ciphertext" />
    <KitFormInputWithCodec v-model:text="d" v-model:codec="d_codec" title="Tag" />
    <KitFormPointCompress
      v-model:curve="curve"
      v-model:p="r"
      v-model:codec="codec"
      title="One-time public key R"
    />

    <!-- Curve Parameters -->
    <div class="divider my-8">
      Curve Parameters
    </div>
    <KitCurveTable v-model:curve="curve" v-model:codec="codec" />
  </div>
</template>
