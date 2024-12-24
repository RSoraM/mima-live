<script setup lang="ts">
// Key Generation
const b = ref(2048);
const key = ref({
  n: 0n,
  e: 0n,
  d: 0n,
  p: 0n,
  q: 0n,
  dP: 0n,
  dQ: 0n,
  qInv: 0n,
});
function genKey() {
  const now = performance.now();
  const k = rsa(b.value);
  const end = performance.now();
  $notify({
    title: 'Key Generation Done',
    message: `Time: ${end - now}ms`,
    type: 'success',
  });
  key.value = {
    n: k.n,
    e: k.e,
    d: k.d,
    p: k.p,
    q: k.q,
    dP: k.dP,
    dQ: k.dQ,
    qInv: k.qInv,
  };
}
function clearKey() {
  key.value = {
    n: 0n,
    e: 0n,
    d: 0n,
    p: 0n,
    q: 0n,
    dP: 0n,
    dQ: 0n,
    qInv: 0n,
  };
}

// Encryption Scheme
const M = ref(UTF8('mima-kit'));
const C = ref(new U8());
const es = ref('RSAES-OAEP');
const es_options: SelectOption[] = [
  { label: 'Primitive', value: 'Primitive' },
  { label: 'RSAES-OAEP', value: 'RSAES-OAEP' },
  { label: 'RSAES-PKCS1-v1_5', value: 'RSAES-PKCS1-v1_5' },
];
const oaep_hash = ref(sha256);
const oaep_mgf = ref('MGF1');
const oaep_mgf_hash = ref(sha256);
const oaep_label = ref(new U8());
const encrypt = catchNotify(() => {
  if (es.value === 'Primitive') {
    const cipher = rsa(key.value);
    C.value = U8.fromBI(cipher.encrypt(M.value));
  }
  else if (es.value === 'RSAES-OAEP') {
    const hash = oaep_hash.value;
    const mgf = mgf1(oaep_mgf_hash.value);
    const label = oaep_label.value;
    const cipher = pkcs1_es_oaep(key.value, hash, mgf, label);
    C.value = cipher.encrypt(M.value);
  }
  else if (es.value === 'RSAES-PKCS1-v1_5') {
    const cipher = pkcs1_es_1_5(key.value);
    C.value = cipher.encrypt(M.value);
  }
});
const decrypt = catchNotify(() => {
  if (es.value === 'Primitive') {
    const cipher = rsa(key.value);
    M.value = U8.fromBI(cipher.decrypt(C.value));
  }
  else if (es.value === 'RSAES-OAEP') {
    const hash = oaep_hash.value;
    const mgf = mgf1(oaep_mgf_hash.value);
    const label = oaep_label.value;
    const cipher = pkcs1_es_oaep(key.value, hash, mgf, label);
    M.value = cipher.decrypt(C.value);
  }
  else if (es.value === 'RSAES-PKCS1-v1_5') {
    const cipher = pkcs1_es_1_5(key.value);
    M.value = cipher.decrypt(C.value);
  }
});

// Signature Scheme with Appendix
const S = ref(new U8());
const ssa = ref('RSASSA-PSS');
const ssa_options: SelectOption[] = [
  { label: 'Primitive', value: 'Primitive' },
  { label: 'RSASSA-PSS', value: 'RSASSA-PSS' },
  { label: 'RSASSA-PKCS1-v1_5', value: 'RSASSA-PKCS1-v1_5' },
];
const v15_hash = ref(sha256);
const pss_hash = ref(sha256);
const pss_mgf = ref('MGF1');
const pss_mgf_hash = ref(sha256);
const pss_salt_length = ref(32);
const sign = catchNotify(() => {
  if (ssa.value === 'Primitive') {
    const signer = rsa(key.value);
    S.value = U8.fromBI(signer.sign(M.value));
  }
  else if (ssa.value === 'RSASSA-PSS') {
    const hash = pss_hash.value;
    const mgf = mgf1(pss_mgf_hash.value);
    const salt_length = pss_salt_length.value;
    const signer = pkcs1_ssa_pss(key.value, hash, mgf, salt_length);
    S.value = signer.sign(M.value);
  }
  else if (ssa.value === 'RSASSA-PKCS1-v1_5') {
    const hash = v15_hash.value;
    const signer = pkcs1_ssa_1_5(key.value, hash);
    S.value = signer.sign(M.value);
  }
});
const verify = catchNotify(() => {
  let isValidationPassed = false;
  if (ssa.value === 'Primitive') {
    const signer = rsa(key.value);
    const R = signer.verify(S.value);
    isValidationPassed = R === M.value.toBI();
  }
  else if (ssa.value === 'RSASSA-PSS') {
    const hash = pss_hash.value;
    const mgf = mgf1(pss_mgf_hash.value);
    const salt_length = pss_salt_length.value;
    const signer = pkcs1_ssa_pss(key.value, hash, mgf, salt_length);
    isValidationPassed = signer.verify(M.value, S.value);
  }
  else if (ssa.value === 'RSASSA-PKCS1-v1_5') {
    const hash = v15_hash.value;
    const signer = pkcs1_ssa_1_5(key.value, hash);
    isValidationPassed = signer.verify(M.value, S.value);
  }

  if (isValidationPassed) {
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
});

// MGF
const mgf_options: SelectOption[] = [
  { label: 'MGF1', value: 'MGF1' },
];

onMounted(async () => nextTick(() => {
  genKey();
  encrypt();
  sign();
}));
</script>

<template>
  <h1 class="mx-auto text-4xl font-bold md:my-8">
    RSA
  </h1>

  <div role="alert" class="alert alert-warning mb-4">
    <span class="icon-[carbon--warning-alt-filled] size-6" />
    <span class="text-sm">
      The speed of Key Generation depends on the local machine.
      Please enter a reasonable <b>Key Size</b> to prevent the browser from crashing.
      Generate <b>4096 bit</b> RSA key pair on 2.3 GHz Quad-Core Intel Core i5, 8GB RAM.
      Cost about <b>1.7-6s</b>
    </span>
  </div>

  <!-- Key Generation -->
  <KitCollapse class="bg-base-200" open>
    <template #header>
      Key Generation
    </template>
    <KitFormNumber v-model="b" title="Key Size (bit)" />
    <KitDivider>
      <KitButton @click="clearKey">
        Clear
      </KitButton>/
      <KitButton @click="genKey">
        Generate
      </KitButton>
    </KitDivider>
    <KitFormBigint
      v-model="key.n"
      :title="`n: modulus (${getBIBits(key.n)} bit)`"
    />
    <KitFormBigint
      v-model="key.e"
      :title="`e: public exponent (${getBIBits(key.e)} bit)`"
    />
    <KitFormBigint
      v-model="key.d"
      :title="`d: private exponent (${getBIBits(key.d)} bit)`"
    />
    <KitCollapse class="mt-4 bg-base-300">
      <template #header>
        Extra Data
      </template>
      <KitFormBigint
        v-model="key.p"
        :title="`p: prime1 (${getBIBits(key.p)} bit)`"
      />
      <KitFormBigint
        v-model="key.q"
        :title="`q: prime2 (${getBIBits(key.q)} bit)`"
      />
      <KitFormBigint
        v-model="key.dP"
        :title="`dP: p's CRT exponent (${getBIBits(key.dP)} bit)`"
      />
      <KitFormBigint
        v-model="key.dQ"
        :title="`dQ: q's CRT exponent (${getBIBits(key.dQ)} bit)`"
      />
      <KitFormBigint
        v-model="key.qInv"
        :title="`qInv: CRT coefficient (${getBIBits(key.qInv)} bit)`"
      />
    </KitCollapse>
  </KitCollapse>

  <!-- Encryption Scheme -->
  <KitCollapse class="mt-4 bg-base-200">
    <template #header>
      Encryption Scheme
    </template>
    <KitFormControl title="Encryption Scheme">
      <KitFormSelect v-model="es" :options="es_options" />
    </KitFormControl>
    <div v-if="es === 'RSAES-OAEP'">
      <KitDivider class="divider-start">
        # 1: Hash
      </KitDivider>
      <KitFormSelectHash v-model="oaep_hash" title="Hash" />
      <KitDivider class="divider-start">
        # 2: Mask Generation Function
      </KitDivider>
      <KitFormControl title="MGF">
        <KitFormSelect v-model="oaep_mgf" :options="mgf_options" />
      </KitFormControl>
      <KitFormSelectHash v-model="oaep_mgf_hash" title="MGF Hash" />
      <KitDivider class="divider-start">
        # 3: Label
      </KitDivider>
      <KitFormU8
        v-model="oaep_label"
        :codec="UTF8"
        title="Label"
      />
    </div>
  </KitCollapse>

  <!-- Signature Scheme -->
  <KitCollapse class="mt-4 bg-base-200">
    <template #header>
      Signature Scheme
    </template>
    <KitFormControl title="Signature Scheme">
      <KitFormSelect v-model="ssa" :options="ssa_options" />
    </KitFormControl>
    <div v-if="ssa === 'RSASSA-PSS'">
      <KitDivider class="divider-start">
        # 1: Hash Algorithm
      </KitDivider>
      <KitFormSelectHash v-model="pss_hash" title="Hash" />
      <KitDivider class="divider-start">
        # 2: Mask Generation Function
      </KitDivider>
      <KitFormControl title="MGF">
        <KitFormSelect v-model="pss_mgf" :options="mgf_options" />
      </KitFormControl>
      <KitFormSelectHash v-model="pss_mgf_hash" title="MGF Hash" />
      <KitDivider class="divider-start">
        # 3: Salt Length
      </KitDivider>
      <KitFormNumber v-model="pss_salt_length" title="Salt Length" />
    </div>
    <div v-if="ssa === 'RSASSA-PKCS1-v1_5'">
      <KitDivider class="divider-start">
        # 1: Hash Algorithm
      </KitDivider>
      <KitFormSelectHash v-model="v15_hash" title="Hash" />
    </div>
  </KitCollapse>

  <!-- OP -->
  <KitDivider>
    <KitButton :disabled="!key.n || !key.e" @click="encrypt">
      Encrypt
    </KitButton>/
    <KitButton :disabled="!key.n || !key.d" @click="decrypt">
      Decrypt
    </KitButton>
  </KitDivider>
  <KitFormU8
    v-model="M"
    :codec="UTF8"
    title="Plain text"
    textarea
  />
  <KitFormU8
    v-model="C"
    :codec="HEX"
    title="Cipher text"
    textarea
  />
  <KitDivider>
    <KitButton :disabled="!key.n || !key.d" @click="sign">
      Sign
    </KitButton>/
    <KitButton :disabled="!key.n || !key.e" @click="verify">
      Verify
    </KitButton>
  </KitDivider>
  <KitFormU8
    v-model="S"
    :codec="HEX"
    title="Signature"
    textarea
  />

  <div class="stats stats-vertical my-6 shadow">
    <KitStat title="Specification">
      <KitRefLink
        :texts="['RFC 8017']"
        icon="icon-[carbon--html-reference]"
        href="https://www.rfc-editor.org/rfc/rfc8017"
      />
    </KitStat>

    <KitStat title="First published">
      1977
    </KitStat>
  </div>
</template>
