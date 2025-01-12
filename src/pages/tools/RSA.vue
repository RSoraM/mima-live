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
    throw new Error('Verification failed');
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
  <ToolsLayout title="RSA">
    <KitFormNumber v-model="b" title="Key Size (bit)" />
    <KitAlert>
      The speed of Key Generation depends on the local machine.
      Please enter a reasonable <b>Key Size</b> to prevent the browser from crashing.
      Generate <b>4096 bit</b> RSA key pair on 2.3 GHz Quad-Core Intel Core i5, 8GB RAM.
      Cost about <b>1.7-6s</b>
    </KitAlert>
    <!-- Key Generation -->
    <KitFoldCard title="Key Pair" :open="false">
      <template #action>
        <KitButton @click="clearKey">
          Clear
        </KitButton>
        <KitButton @click="genKey">
          Generate
        </KitButton>
      </template>
      <KitFormBigint v-model="key.n" :title="`n: modulus (${getBIBits(key.n)} bit)`" />
      <KitFormBigint v-model="key.e" :title="`e: public exponent (${getBIBits(key.e)} bit)`" />
      <KitFormBigint v-model="key.d" :title="`d: private exponent (${getBIBits(key.d)} bit)`" />
      <KitFoldCard title="Extra Data" :open="false" class="mt-2">
        <KitFormBigint v-model="key.p" :title="`p: prime1 (${getBIBits(key.p)} bit)`" />
        <KitFormBigint v-model="key.q" :title="`q: prime2 (${getBIBits(key.q)} bit)`" />
        <KitFormBigint v-model="key.dP" :title="`dP: p's CRT exponent (${getBIBits(key.dP)} bit)`" />
        <KitFormBigint v-model="key.dQ" :title="`dQ: q's CRT exponent (${getBIBits(key.dQ)} bit)`" />
        <KitFormBigint v-model="key.qInv" :title="`qInv: CRT coefficient (${getBIBits(key.qInv)} bit)`" />
      </KitFoldCard>
    </KitFoldCard>
    <!-- Encryption Scheme -->
    <KitFoldCard title="Encryption Scheme" :open="false">
      <KitFormSelect v-model="es" :options="es_options" class="w-full" />
      <div v-if="es === 'RSAES-OAEP'">
        <KitFoldCard title="1: Hash Algorithm" class="mt-2" :open="false">
          <KitFormSelectHash v-model="oaep_hash" class="w-full" />
        </KitFoldCard>
        <KitFoldCard title="2: Mask Generation Function" class="mt-2" :open="false">
          <KitFormSelect v-model="oaep_mgf" :options="mgf_options" class="w-full" />
          <KitFormSelectHash v-model="oaep_mgf_hash" title="MGF Hash" />
        </KitFoldCard>
        <KitFoldCard title="3: Label" class="mt-2" :open="false">
          <KitFormU8 v-model="oaep_label" :codec="UTF8" class="w-full" />
        </KitFoldCard>
      </div>
    </KitFoldCard>
    <!-- Encryption -->
    <KitFoldCard title="Encryption" :open="false">
      <template #action>
        <KitButton :disabled="!key.n || !key.e" @click="encrypt">
          Encrypt
        </KitButton>
        <KitButton :disabled="!key.n || !key.d" @click="decrypt">
          Decrypt
        </KitButton>
      </template>
      <KitFormU8 v-model="M" title="Plain text" textarea :codec="UTF8" />
      <KitFormU8 v-model="C" title="Cipher text" textarea :codec="HEX" />
    </KitFoldCard>
    <!-- Signature Scheme -->
    <KitFoldCard title="Signature Scheme" :open="false">
      <template #header>
        Signature Scheme
      </template>
      <KitFormSelect v-model="ssa" :options="ssa_options" class="w-full" />
      <div v-if="ssa === 'RSASSA-PSS'">
        <KitFoldCard title="1: Hash Algorithm" class="mt-2" :open="false">
          <KitFormSelectHash v-model="pss_hash" class="w-full" />
        </KitFoldCard>
        <KitFoldCard title="2: Mask Generation Function" class="mt-2" :open="false">
          <KitFormSelect v-model="pss_mgf" :options="mgf_options" class="w-full" />
          <KitFormSelectHash v-model="pss_mgf_hash" title="MGF Hash" />
        </KitFoldCard>
        <KitFoldCard title="3: Salt Length" class="mt-2" :open="false">
          <KitFormNumber v-model="pss_salt_length" class="w-full" />
        </KitFoldCard>
      </div>
      <div v-if="ssa === 'RSASSA-PKCS1-v1_5'">
        <KitFoldCard title="1: Hash Algorithm" class="mt-2" :open="false">
          <KitFormSelectHash v-model="v15_hash" class="w-full" />
        </KitFoldCard>
      </div>
    </KitFoldCard>
    <!-- Signature -->
    <KitFoldCard title="Signature" :open="false">
      <template #action>
        <KitButton :disabled="!key.n || !key.d" @click="sign">
          Sign
        </KitButton>
        <KitButton :disabled="!key.n || !key.e" @click="verify">
          Verify
        </KitButton>
      </template>
      <KitFormU8
        v-model="M" :codec="UTF8"
        title="Message"
        textarea
      />
      <KitFormU8
        v-model="S" :codec="HEX"
        title="Signature"
        textarea
      />
    </KitFoldCard>

    <template #stat>
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
    </template>
  </ToolsLayout>
</template>
