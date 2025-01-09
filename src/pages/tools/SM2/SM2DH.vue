<script setup lang="ts">
import type { ECPublicKey } from 'mima-kit';

defineOptions({ name: 'SM2DH' });

// Curve
const curve = ref(sm2p256v1);
const ec = computed(() => sm2(curve.value));
const hash = ref(sm3);
// defineEntity
function defineEntity(name: string) {
  return defineStore(`sm2-dh-${name}`, () => {
    const key_x = ref(ec.value.gen());
    const key_y = ref(ec.value.gen());
    const x_d_bi = computed(() => key_x.value.d.toBI());
    const x_d_bit = computed(() => getBIBits(x_d_bi.value));
    const x_x_bi = computed(() => key_x.value.Q.x.toBI());
    const x_x_bit = computed(() => getBIBits(x_x_bi.value));
    const x_y_bi = computed(() => key_x.value.Q.y.toBI());
    const x_y_bit = computed(() => getBIBits(x_y_bi.value));
    const y_d_bi = computed(() => key_y.value.d.toBI());
    const y_d_bit = computed(() => getBIBits(y_d_bi.value));
    const y_x_bi = computed(() => key_y.value.Q.x.toBI());
    const y_x_bit = computed(() => getBIBits(y_x_bi.value));
    const y_y_bi = computed(() => key_y.value.Q.y.toBI());
    const y_y_bit = computed(() => getBIBits(y_y_bi.value));
    const key_x_bi = computed(() => ({
      d: x_d_bi.value,
      Q: {
        isInfinity: key_x.value.Q.isInfinity,
        x: x_x_bi.value,
        y: x_y_bi.value,
      },
    }));
    const key_y_bi = computed(() => ({
      d: y_d_bi.value,
      Q: {
        isInfinity: key_y.value.Q.isInfinity,
        x: y_x_bi.value,
        y: y_y_bi.value,
      },
    }));

    const id = ref(UTF8(`${name}@mima.kit`));
    const di = computed(() => ec.value.di(id.value, key_x.value, hash.value));

    const secret = ref(new U8());
    const secret_bit = computed(() => getBIBits(secret.value.toBI()));

    const $reset = () => {
      key_x.value = { d: new U8(), Q: U8Point() };
      key_y.value = { d: new U8(), Q: U8Point() };
      id.value = UTF8(`${name}@mima.kit`);
      secret.value = new U8();
    };

    const gen = () => {
      secret.value = new U8();
      key_x.value = ec.value.gen();
      key_y.value = ec.value.gen();
    };
    const genX = () => {
      secret.value = new U8();
      key_x.value = ec.value.gen();
    };
    const genY = () => {
      secret.value = new U8();
      key_y.value = ec.value.gen();
    };
    const clearX = () => key_x.value = { d: new U8(), Q: U8Point() };
    const clearY = () => key_y.value = { d: new U8(), Q: U8Point() };

    const dh = (key_a: ECPublicKey, key_b: ECPublicKey, di_i: Uint8Array, di_r: Uint8Array) => {
      secret.value = ec.value.dh(
        key_x_bi.value,
        key_y_bi.value,
        key_a,
        key_b,
        di_i,
        di_r,
      );
    };
    return {
      key_x,
      key_y,
      x_d_bit,
      x_x_bit,
      x_y_bit,
      key_x_bi,
      y_d_bit,
      y_x_bit,
      y_y_bit,
      key_y_bi,
      id,
      di,
      secret,
      secret_bit,
      $reset,
      gen,
      genX,
      genY,
      clearX,
      clearY,
      dh,
    };
  });
}
// Alice
const alice = defineEntity('alice')();
// Bob
const bob = defineEntity('bob')();

const kdf = ref(x963kdf(sha256));
const k_bit = ref(256);
const okm_a = ref(new U8());
const okm_b = ref(new U8());
function execKDF() {
  okm_a.value = kdf.value(k_bit.value, alice.secret);
  okm_b.value = kdf.value(k_bit.value, bob.secret);
}

async function dh() {
  alice.dh(bob.key_x, bob.key_y, alice.di, bob.di);
  bob.dh(alice.key_x, alice.key_y, alice.di, bob.di);
}
watch(
  curve,
  catchNotifySync(() => {
    alice.$reset();
    bob.$reset();
  }),
);

onMounted(async () => dh());
</script>

<template>
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    SM2-DH
  </h1>
  <KitDivider class="divider-start">
    # Step 0: Choose Curve
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormSelectCurve v-model="curve" title="" class="w-full" />
  </div>
  <KitDivider class="divider-start">
    # Step 1: Choose Hash For DI
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormSelectHash v-model="hash" title="" class="w-full" />
  </div>
  <KitDivider class="divider-start">
    # Step 2: Alice's Key A
  </KitDivider>
  <div class="border-l pl-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dA</u></b>.</li>
      <li>Compute PublicKey <b><u>QA</u></b>.</li>
    </ul>
    <KitFormU8
      v-model="alice.key_x.d"
      :codec="HEX"
      :title="`dA (${alice.x_d_bit} bit)`"
    />
    <KitFormECCPoint
      v-model="alice.key_x.Q"
      :curve="curve"
      name="QA"
      :x-bit="alice.x_x_bit"
      :y-bit="alice.x_y_bit"
    />
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="alice.clearX()">
        Clear
      </KitButton>
      <KitButton @click="alice.genX()">
        Generate
      </KitButton>
    </div>
  </div>
  <KitDivider class="divider-start">
    # Step 3: Alice's Key X
  </KitDivider>
  <div class="border-l pl-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dX</u></b>.</li>
      <li>Compute PublicKey <b><u>QX</u></b>.</li>
    </ul>
    <KitFormU8
      v-model="alice.key_y.d"
      :codec="HEX"
      :title="`dX (${alice.y_d_bit} bit)`"
    />
    <KitFormECCPoint
      v-model="alice.key_y.Q"
      :curve="curve"
      name="QX"
      :x-bit="alice.y_x_bit"
      :y-bit="alice.y_y_bit"
    />
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="alice.clearY()">
        Clear
      </KitButton>
      <KitButton @click="alice.genY()">
        Generate
      </KitButton>
    </div>
  </div>
  <KitDivider class="divider-start">
    # Step 4: Alice's Identifier
  </KitDivider>
  <div class="border-l pl-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Compute Alice's Identifier <b><u>ZA</u></b>.</li>
      <li>Send <b><u>QA</u></b>, <b><u>QX</u></b> and <b><u>ZA</u></b> to <b><u>Bob</u></b>.</li>
    </ul>
    <KitFormU8
      v-model="alice.id" :codec="UTF8"
      :immediate="true"
      title="ID"
    />
    <KitFormU8
      v-model="alice.di"
      :codec="HEX"
      title="ZA"
    />
  </div>
  <KitDivider class="divider-start">
    # Step 5: Bob's Key B
  </KitDivider>
  <div class="border-l pl-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dB</u></b>.</li>
      <li>Compute PublicKey <b><u>QB</u></b>.</li>
    </ul>
    <KitFormU8
      v-model="bob.key_x.d"
      :codec="HEX"
      :title="`dB (${bob.x_d_bit} bit)`"
    />
    <KitFormECCPoint
      v-model="bob.key_x.Q"
      :curve="curve"
      name="QB"
      :x-bit="bob.x_x_bit"
      :y-bit="bob.x_y_bit"
    />
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="bob.clearX()">
        Clear
      </KitButton>
      <KitButton @click="bob.genX()">
        Generate
      </KitButton>
    </div>
  </div>
  <KitDivider class="divider-start">
    # Step 6: Bob's Key Y
  </KitDivider>
  <div class="border-l pl-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dY</u></b>.</li>
      <li>Compute PublicKey <b><u>QY</u></b>.</li>
    </ul>
    <KitFormU8
      v-model="bob.key_y.d"
      :codec="HEX"
      :title="`dY (${bob.y_d_bit} bit)`"
    />
    <KitFormECCPoint
      v-model="bob.key_y.Q"
      :curve="curve"
      name="QY"
      :x-bit="bob.y_x_bit"
      :y-bit="bob.y_y_bit"
    />
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="bob.clearY()">
        Clear
      </KitButton>
      <KitButton @click="bob.genY()">
        Generate
      </KitButton>
    </div>
  </div>
  <KitDivider class="divider-start">
    # Step 7: Bob's Identifier
  </KitDivider>
  <div class="border-l pl-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Compute Bob's Identifier <b><u>ZB</u></b>.</li>
      <li>Send <b><u>QB</u></b>, <b><u>QY</u></b> and <b><u>ZB</u></b> to <b><u>Alice</u></b>.</li>
    </ul>
    <KitFormU8
      v-model="bob.id" :codec="UTF8"
      :immediate="true"
      title="ID"
    />
    <KitFormU8
      v-model="bob.di"
      :codec="HEX"
      title="ZB"
    />
  </div>
  <KitDivider class="divider-start">
    # Step 8: Compute Secret
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormU8
      v-model="alice.secret"
      :codec="HEX"
      :title="`Alice's Secret (${alice.secret_bit} bit)`"
      textarea
    />
    <KitFormU8
      v-model="bob.secret"
      :codec="HEX"
      :title="`Bob's Secret (${bob.secret_bit} bit)`"
      textarea
    />
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="dh()">
        Compute Secret
      </KitButton>
    </div>
  </div>
  <KitDivider class="divider-start">
    # Appendix: KDF
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormNumber v-model="k_bit" title="Output Key Size (bit)" />
    <KitFormSelectKDF v-model="kdf" title="KDF" class="w-full" />
    <KitDivider class="divider-start">
      # KDF Result
    </KitDivider>
    <KitFormU8
      v-model="okm_a"
      :codec="HEX"
      :title="`KDF Alice (${okm_a.length} byte)`"
      textarea
    />
    <KitFormU8
      v-model="okm_b"
      :codec="HEX"
      :title="`KDF Bob (${okm_b.length} byte)`"
      textarea
    />
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="execKDF()">
        Compute
      </KitButton>
    </div>
  </div>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
