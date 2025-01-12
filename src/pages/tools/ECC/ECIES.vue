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
  <ToolsLayout title="ECIES">
    <KitFoldCard title="0: Elliptic Curve" :open="false">
      <KitFormSelectCurve v-model="curve" class="w-full" />
    </KitFoldCard>
    <KitFoldCard title="1: Key Pair" :open="false">
      <template #action>
        <KitButton @click="key.$reset()">
          Clear
        </KitButton>
        <KitButton @click="key.gen()">
          Generate
        </KitButton>
      </template>
      <ul class="mb-2 ml-6 list-disc text-xs">
        <li>PrivateKey <b><u>d</u></b>.</li>
        <li>PublicKey <b><u>Q</u></b>.</li>
      </ul>
      <KitFormU8
        v-model="key.d" :codec="HEX"
        :title="`d (${key.d_bit} bit)`"
      />
      <KitFormECCPoint
        v-model="key.Q" :curve="curve"
        :x-bit="key.x_bit" :y-bit="key.y_bit"
        name="Q"
      />
    </KitFoldCard>
    <KitFoldCard title="2: IES Components" :open="false">
      <KitFoldCard title="2.1: Block Cipher" :open="false">
        <KitFormSelectBlockCipher v-model="cipher_alg" class="w-full" />
        <KitFormModeConfig v-model="cipher" :block-cipher="cipher_alg" />
      </KitFoldCard>
      <KitFoldCard title="2.2: MAC Algorithm" class="mt-2" :open="false">
        <KitFormSelectMAC v-model="mac" class="w-full" title-prefix="2.2." />
      </KitFoldCard>
      <KitFoldCard title="2.3: KDF Algorithm" class="mt-2" :open="false">
        <KitFormSelectKDF v-model="kdf" title-prefix="2.3." class="w-full" />
      </KitFoldCard>
      <KitFoldCard title="2.4: Additional Data" class="mt-2" :open="false">
        <KitFormU8 v-model="S1" :codec="UTF8" title="S1" />
        <KitFormU8 v-model="S2" :codec="UTF8" title="S2" />
        <KitFormU8
          v-if="!cipher.ALGORITHM.startsWith('ECB')"
          v-model="iv" :codec="UTF8"
          title="IV"
        />
      </KitFoldCard>
    </KitFoldCard>
    <KitFoldCard title="3: Encryption" :open="false">
      <template #action>
        <KitButton @click="decrypt()">
          Decrypt
        </KitButton>
        <KitButton @click="encrypt()">
          Encrypt
        </KitButton>
      </template>
      <KitFormU8 v-model="M" title="Plaintext" textarea :codec="UTF8" />
      <KitFormU8 v-model="C" title="Ciphertext" textarea :codec="HEX" />
      <KitFormU8 v-model="D" title="Tag" :codec="HEX" />
      <KitFoldCard title="One-Time Public Key R" open class="mt-2">
        <KitFormECCPoint v-model="r.Q" name="R" :curve="curve" />
      </KitFoldCard>
    </KitFoldCard>

    <!-- Curve Parameters -->
    <KitFoldCard title="Appendix: Curve Parameters" :open="false">
      <KitCurveTable :curve="curve" :codec="HEX" />
    </KitFoldCard>
  </ToolsLayout>
</template>
