<script setup lang="ts">
interface RSAPrivateKey {
  /** 模数 / Modulus */
  n: string;
  /** 公钥指数 / Public Exponent */
  e: string;
  /** 私钥指数 / Private Exponent */
  d: string;
  p: string;
  q: string;
  dP: string;
  dQ: string;
  qInv: string;
}

// Key Generation
const b = ref(2048);
const k = reactive<RSAPrivateKey>({
  n: '7cfabc8e81a2e7031b2439285453262b58bff3edab3e4a404b8bc87d57481367ce3971bbe2901d2a7e5650b1e16d1f1bf227c20dac9f2a088ff4415be404e6ee5d8847ae24337224075520ccfaad498a7dc3ae742db32626830d86b2fb3409a73822eaca0da06df1b1cfdb42084878eb4b3a88b3d9119eb940ef54286e08cc9d4f6e727ccee172abfa32c6f62a504b0416f92a29e886fe5a1cdce3152c0298c4135ebd23c6364164a82f66016f9e1d85d39db72434f01482eca43555a5aec1962dacd2aeaadf7a05765387e52e58799a4e167a33e2a1d69e7710dc167864e13408e7d31ee0765beafbfd4fb854994e7df28c13d1300b9f472cd6b31008b59075',
  e: '010001',
  d: '351ab959f81d86f95be405616c8b3431c0f1372daad0b9ee1deb945225ef1b47c569c538e76902eb966908babca5884d709492310b434a31ff30f3409f5fb1dc60e3d2495d5a7aca724f2ab3ce6429566e5fe255bd415d198a200a372ce40ca200095e2862a7e36f8a755e9ded3516242c7fffac23b507f38172f01889c0b5681b55f1618766b3b30d7abfa09a7aced67bf7e1504673bc635afef5ae85936cce5627a42eb38f5b35f0e0e11b32c709d6b9f255c22a113b3a7ee37b39faa06f9f52e61b713821246f7bc711095310ca89500fb5e32fc02d500980263b0e7e28c272fdfa1f7b29643364b8eb860fa3937fb4ddfbf86909dd5ab73fef1da5cb95d5',
  p: '927ad3b125ee07b49196aae5dc37011489aae8d02813b07743b5af828422605699e7efe0278ed38168d5c882a6dd8a27ee8e909b6a7d681de53b774342967c2b1b171271226173050b686668cb2a8ae9f52640fdf6f21bea776ace668ef42b51c80b1b011a58c6cf2f6350ed7fcfbd66436d6f26559dd6d0defee96e06faa733',
  q: 'da6c9a9e17813d1d123252e0fcbc743d5ad9c45c228a63ba62cc62c8bedbec79fc937d8780ff1fcedb3ad189602dbce99aa8afe23b63ff9f48d3d036fa18c1905f9513a317daefcd3cdd7fc8f7058aa610653e284f1b3b943f562fb579eaba6200ba2e011917f3f4a7df4cbb440ba53b62fc40dd1333ed650652eaa174bbc9b7',
  dP: '3cf2b8849c38a7a21d75e8940e0620ffefac5a84ca382f13e0eb8724b2602f5fb958457a2a5b866bf1380adf3a1932341d51da9fa036a00cd865dee0f0a2f6f564a73bf8310b0535d3225482440ee690247e0f4adce6ae70e7d15c225657087355de31154b66270aec37d1e3906bdaede31e74c2299bac576a81fc94d87890fb',
  dQ: 'a56b3499e011379869ac8509f13e44062764df0a2bfa84d6a67645a5e4ada7e526bd088773d14364a4b161f95946aa587c919e4a86521048b09e018571590856ef9c7637c11c451a392b42d88f03ba6253ee68e99c2772b2ae58f65ec90b54c65de8a268a0797c7f601784041adf7aee83e3a8b80510018cce0243c1ad277ef7',
  qInv: '7fab9fe25f6a8eac37c5b8364559ecc8146bd0619e2bdfd5395d58fc1a62c68b9da7cec0cb2a1e09069560e4d5fb666aaee781e926c043afd3eff903444daed9d57c3350ae98a48a7b112aebbed3069b58a320533691cb7a8319cb999223218c11e8d6ab347ba39c31b643b9c321b0a24643322b1d1c5925932cbaf32a989b91',
});
const k_codec = ref(HEX);
function genKey() {
  const now = performance.now();
  const key = rsa(b.value);
  const end = performance.now();
  $notify({
    title: 'Key Generation Done',
    message: `Time: ${end - now}ms`,
    type: 'success',
  });
  k.n = U8.fromBI(key.n).to(k_codec.value);
  k.e = U8.fromBI(key.e).to(k_codec.value);
  k.d = U8.fromBI(key.d).to(k_codec.value);
  k.p = U8.fromBI(key.p).to(k_codec.value);
  k.q = U8.fromBI(key.q).to(k_codec.value);
  k.dP = U8.fromBI(key.dP).to(k_codec.value);
  k.dQ = U8.fromBI(key.dQ).to(k_codec.value);
  k.qInv = U8.fromBI(key.qInv).to(k_codec.value);
}
function clearKey() {
  k.n = '';
  k.e = '';
  k.d = '';
  k.p = '';
  k.q = '';
  k.dP = '';
  k.dQ = '';
  k.qInv = '';
}
const k_raw = ref<{ [K in keyof RSAPrivateKey]: bigint }>({
  n: 0n,
  e: 0n,
  d: 0n,
  p: 0n,
  q: 0n,
  dP: 0n,
  dQ: 0n,
  qInv: 0n,
});
watch(
  k,
  catchNotifySync(() => (k_raw.value = {
    n: k.n ? k_codec.value(k.n).toBI() : 0n,
    e: k.e ? k_codec.value(k.e).toBI() : 0n,
    d: k.d ? k_codec.value(k.d).toBI() : 0n,
    p: k.p ? k_codec.value(k.p).toBI() : 0n,
    q: k.q ? k_codec.value(k.q).toBI() : 0n,
    dP: k.dP ? k_codec.value(k.dP).toBI() : 0n,
    dQ: k.dQ ? k_codec.value(k.dQ).toBI() : 0n,
    qInv: k.qInv ? k_codec.value(k.qInv).toBI() : 0n,
  })),
  {
    immediate: true,
  },
);

// Encryption Scheme
const m = ref('mima-kit');
const m_codec = ref(UTF8);
const c = ref('1745ed9a111af0bdee37b2e33582d180686951224b551e7981682c0f2017476744f0dd12db1a7f6a0ff6c6e1a9161e4d83837dec3dee14ef529ad45240e10002e5f72d29eb25f819466304326c84dbebb4f3b493fe54a111abec8836757acc7797ab0a8d31e29ed0ee7a039f93a1a156e3d9fc5710ffad27e4567904e077cfff31d118b2fac4a7225294f48569cd230661df662d054220ad1e6d86526e49d049090c59fd9d8ef0464c53b7d8da62e1856a79cb5f11a27571bb0ebfc94f41b0ce33b43043f0571f0344cef0ed93dd6ef929750254b020880004c0cc5072a638501b18ed04a5c12974557eb70cf13282ad13f367a4561ef236f22fc3cc5537ed4b');
const c_codec = ref(HEX);
const es = ref('RSAES-OAEP');
const es_options: SelectOption[] = [
  {
    label: 'Primitive',
    value: 'Primitive',
  },
  {
    label: 'RSAES-OAEP',
    value: 'RSAES-OAEP',
  },
  {
    label: 'RSAES-PKCS1-v1_5',
    value: 'RSAES-PKCS1-v1_5',
  },
];
const oaep_hash = ref(sha256);
const oaep_mgf = ref('MGF1');
const oaep_mgf_hash = ref(sha256);
const oaep_label = ref('');
const oaep_label_codec = ref(UTF8);
const encrypt = catchNotify(() => {
  if (es.value === 'Primitive') {
    const key = rsa(k_raw.value);
    const C = key.encrypt(m_codec.value(m.value));
    c.value = c_codec.value(U8.fromBI(C));
  }
  else if (es.value === 'RSAES-OAEP') {
    const hash = oaep_hash.value;
    const mgf = mgf1(oaep_mgf_hash.value);
    const label = oaep_label_codec.value(oaep_label.value);
    const cipher = pkcs1_es_oaep(k_raw.value, hash, mgf, label);
    const C = cipher.encrypt(m_codec.value(m.value));
    c.value = c_codec.value(C);
  }
  else if (es.value === 'RSAES-PKCS1-v1_5') {
    const cipher = pkcs1_es_1_5(k_raw.value);
    const C = cipher.encrypt(m_codec.value(m.value));
    c.value = c_codec.value(C);
  }
});
const decrypt = catchNotify(() => {
  if (es.value === 'Primitive') {
    const key = rsa(k_raw.value);
    const M = key.decrypt(c_codec.value(c.value));
    m.value = m_codec.value(U8.fromBI(M));
  }
  else if (es.value === 'RSAES-OAEP') {
    const hash = oaep_hash.value;
    const mgf = mgf1(oaep_mgf_hash.value);
    const label = oaep_label_codec.value(oaep_label.value);
    const cipher = pkcs1_es_oaep(k_raw.value, hash, mgf, label);
    const M = cipher.decrypt(c_codec.value(c.value));
    m.value = m_codec.value(M);
  }
  else if (es.value === 'RSAES-PKCS1-v1_5') {
    const cipher = pkcs1_es_1_5(k_raw.value);
    const M = cipher.decrypt(c_codec.value(c.value));
    m.value = m_codec.value(M);
  }
});

// Signature Scheme with Appendix
const s = ref('3f7b872a48c18853ed996afba0b24de7e332a7d2cb9d2b2428de0a7255d1aa5a11656df1c2283c17cfb8e21d5b36bb04e2d885e85f1b84f1dc3a1ee80f5087b6ca92f9d897f65d27b40152f1c7fad2fb339570f17fa460ec304441eb055292b6d1d58784ab69cf3d4b167c47457ed4356e326118221d2404ea6688c351afa2e63fadfe996df6f1086292804996180e6950dec81b9693ea4b8fcddb2a1b9b82eb4f098fbb1d39ac632fe14ac7eba56aea2cdfa33ad6df1ed7ab53bf72c5421206b664a6d2cd1131ea7c1fb1934c80d23ab6c697937bcf8b04091eb80239b7dcc42096076613fd7cf5e7ce74bb59b0f40df7efb66694a69f355075509253986835');
const s_codec = ref(HEX);
const ssa = ref('RSASSA-PSS');
const ssa_options: SelectOption[] = [
  {
    label: 'Primitive',
    value: 'Primitive',
  },
  {
    label: 'RSASSA-PSS',
    value: 'RSASSA-PSS',
  },
  {
    label: 'RSASSA-PKCS1-v1_5',
    value: 'RSASSA-PKCS1-v1_5',
  },
];
const v15_hash = ref(sha256);
const pss_hash = ref(sha256);
const pss_mgf = ref('MGF1');
const pss_mgf_hash = ref(sha256);
const pss_salt_length = ref(32);
const sign = catchNotify(() => {
  if (ssa.value === 'Primitive') {
    const key = rsa(k_raw.value);
    const S = key.sign(m_codec.value(m.value));
    s.value = s_codec.value(U8.fromBI(S));
  }
  else if (ssa.value === 'RSASSA-PSS') {
    const hash = pss_hash.value;
    const mgf = mgf1(pss_mgf_hash.value);
    const saltLength = pss_salt_length.value;
    const cipher = pkcs1_ssa_pss(k_raw.value, hash, mgf, saltLength);
    const S = cipher.sign(m_codec.value(m.value));
    s.value = s_codec.value(S);
  }
  else if (ssa.value === 'RSASSA-PKCS1-v1_5') {
    const cipher = pkcs1_ssa_1_5(k_raw.value, v15_hash.value);
    const S = cipher.sign(m_codec.value(m.value));
    s.value = s_codec.value(S);
  }
});
const verify = catchNotify(() => {
  let isValidationPassed = false;
  if (ssa.value === 'Primitive') {
    const key = rsa(k_raw.value);
    const M = key.verify(s_codec.value(s.value));
    isValidationPassed = m.value === m_codec.value(U8.fromBI(M));
  }
  else if (ssa.value === 'RSASSA-PSS') {
    const hash = pss_hash.value;
    const mgf = mgf1(pss_mgf_hash.value);
    const saltLength = pss_salt_length.value;
    const cipher = pkcs1_ssa_pss(k_raw.value, hash, mgf, saltLength);
    const M = m_codec.value(m.value);
    const S = s_codec.value(s.value);
    isValidationPassed = cipher.verify(M, S);
  }
  else if (ssa.value === 'RSASSA-PKCS1-v1_5') {
    const cipher = pkcs1_ssa_1_5(k_raw.value, v15_hash.value);
    const M = m_codec.value(m.value);
    const S = s_codec.value(s.value);
    isValidationPassed = cipher.verify(M, S);
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
  {
    label: 'MGF1',
    value: 'MGF1',
  },
];
</script>

<template>
  <div>
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
      <KitFormInput v-model="b" type="number" title="Key Size (bit)" />
      <div class="divider my-8">
        <KitButton @click="clearKey">
          Clear
        </KitButton>/
        <KitButton @click="genKey">
          Generate
        </KitButton>
      </div>
      <KitFormInputWithCodec
        v-model:codec="k_codec"
        v-model:text="k.n"
        :title="`n: modulus (${getBIBits(k_raw.n)} bit)`"
      />
      <KitFormInputWithCodec
        v-model:codec="k_codec"
        v-model:text="k.e"
        :title="`e: public exponent (${getBIBits(k_raw.e)} bit)`"
      />
      <KitFormInputWithCodec
        v-model:codec="k_codec"
        v-model:text="k.d"
        :title="`d: private exponent (${getBIBits(k_raw.d)} bit)`"
      />
      <KitCollapse class="mt-4 bg-base-300">
        <template #header>
          Extra Data
        </template>
        <KitFormInputWithCodec
          v-model:codec="k_codec"
          v-model:text="k.p"
          :title="`p: prime1 (${getBIBits(k_raw.p)} bit)`"
        />
        <KitFormInputWithCodec
          v-model:codec="k_codec"
          v-model:text="k.q"
          :title="`q: prime2 (${getBIBits(k_raw.q)} bit)`"
        />
        <KitFormInputWithCodec
          v-model:codec="k_codec"
          v-model:text="k.dP"
          :title="`dP: p's CRT exponent (${getBIBits(k_raw.dP)} bit)`"
        />
        <KitFormInputWithCodec
          v-model:codec="k_codec"
          v-model:text="k.dQ"
          :title="`dQ: q's CRT exponent (${getBIBits(k_raw.dQ)} bit)`"
        />
        <KitFormInputWithCodec
          v-model:codec="k_codec"
          v-model:text="k.qInv"
          :title="`qInv: CRT coefficient (${getBIBits(k_raw.qInv)} bit)`"
        />
      </KitCollapse>
    </KitCollapse>

    <!-- Encryption Scheme -->
    <KitCollapse class="mt-4 bg-base-200">
      <template #header>
        Encryption Scheme
      </template>
      <KitFormControl title="Encryption Scheme">
        <KitBaseFormSelect v-model="es" :options="es_options" />
      </KitFormControl>
      <div v-if="es === 'RSAES-OAEP'">
        <div class="divider divider-start my-4 mb-2">
          #1: Hash Algorithm
        </div>
        <KitFormHashSelect v-model="oaep_hash" title="Hash" />
        <div class="divider divider-start my-4 mb-2">
          #2: Mask Generation Function
        </div>
        <KitFormControl title="MGF">
          <KitBaseFormSelect v-model="oaep_mgf" :options="mgf_options" />
        </KitFormControl>
        <KitFormHashSelect v-model="oaep_mgf_hash" title="MGF Hash" />
        <div class="divider divider-start my-4 mb-2">
          #3: Label data
        </div>
        <KitFormInputWithCodec v-model:text="oaep_label" v-model:codec="oaep_label_codec" title="Label" />
      </div>
    </KitCollapse>

    <!-- Signature Scheme -->
    <KitCollapse class="mt-4 bg-base-200">
      <template #header>
        Signature Scheme
      </template>
      <KitFormControl title="Signature Scheme">
        <KitBaseFormSelect v-model="ssa" :options="ssa_options" />
      </KitFormControl>
      <div v-if="ssa === 'RSASSA-PSS'">
        <div class="divider divider-start my-4 mb-2">
          #1: Hash Algorithm
        </div>
        <KitFormHashSelect v-model="pss_hash" title="Hash" />
        <div class="divider divider-start my-4 mb-2">
          #2: Mask Generation Function
        </div>
        <KitFormControl title="MGF">
          <KitBaseFormSelect v-model="pss_mgf" :options="mgf_options" />
        </KitFormControl>
        <KitFormHashSelect v-model="pss_mgf_hash" title="MGF Hash" />
        <div class="divider divider-start my-4 mb-2">
          #3: Salt Length
        </div>
        <KitFormInput v-model="pss_salt_length" type="number" title="Salt Length" />
      </div>
      <div v-if="ssa === 'RSASSA-PKCS1-v1_5'">
        <div class="divider divider-start my-4 mb-2">
          #1: Hash Algorithm
        </div>
        <KitFormHashSelect v-model="v15_hash" title="Hash" />
      </div>
    </KitCollapse>

    <!-- OP -->
    <div class="divider my-8">
      <KitButton :disabled="!k.n || !k.e" @click="encrypt">
        Encrypt
      </KitButton>/
      <KitButton :disabled="!k.n || !k.d" @click="decrypt">
        Decrypt
      </KitButton>
    </div>
    <KitFormTextAreaWithCodec v-model:text="m" v-model:codec="m_codec" title="Plain text" />
    <KitFormTextAreaWithCodec v-model:text="c" v-model:codec="c_codec" title="Cipher text" />
    <div class="divider my-8">
      <KitButton :disabled="!k.n || !k.d" @click="sign">
        Sign
      </KitButton>/
      <KitButton :disabled="!k.n || !k.e" @click="verify">
        Verify
      </KitButton>
    </div>
    <KitFormTextAreaWithCodec v-model:text="s" v-model:codec="s_codec" title="Signature" />

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
  </div>
</template>
