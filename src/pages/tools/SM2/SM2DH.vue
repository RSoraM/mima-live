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
  <ToolsLayout title="SM2-DH">
    <KitFoldCard title="0: Elliptic Curve" :open="false">
      <KitFormSelectCurve v-model="curve" class="w-full" />
    </KitFoldCard>
    <KitFoldCard title="1: Hash Algorithm" :open="false">
      <KitFormSelectHash v-model="hash" class="w-full" />
    </KitFoldCard>
    <KitFoldCard title="2: Alice's Components" :open="false">
      <KitFoldCard title="2.1: Alice's Key A" :open="false">
        <template #action>
          <KitButton @click="alice.clearX()">
            Clear
          </KitButton>
          <KitButton @click="alice.genX()">
            Generate
          </KitButton>
        </template>
        <ul class="mb-2 ml-6 list-disc text-xs">
          <li>Generate PrivateKey <b><u>dA</u></b>.</li>
          <li>Compute PublicKey <b><u>QA</u></b>.</li>
        </ul>
        <KitFormU8
          v-model="alice.key_x.d" :codec="HEX"
          :title="`dA (${alice.x_d_bit} bit)`"
        />
        <KitFormECCPoint
          v-model="alice.key_x.Q" :curve="curve"
          :x-bit="alice.x_x_bit" :y-bit="alice.x_y_bit"
          name="QA"
        />
      </KitFoldCard>
      <KitFoldCard title="2.2: Alice's Key X" class="mt-2" :open="false">
        <template #action>
          <KitButton @click="alice.clearY()">
            Clear
          </KitButton>
          <KitButton @click="alice.genY()">
            Generate
          </KitButton>
        </template>
        <ul class="mb-2 ml-6 list-disc text-xs">
          <li>Generate PrivateKey <b><u>dX</u></b>.</li>
          <li>Compute PublicKey <b><u>QX</u></b>.</li>
        </ul>
        <KitFormU8
          v-model="alice.key_y.d" :codec="HEX"
          :title="`dX (${alice.y_d_bit} bit)`"
        />
        <KitFormECCPoint
          v-model="alice.key_y.Q" :curve="curve"
          :x-bit="alice.y_x_bit" :y-bit="alice.y_y_bit"
          name="QX"
        />
      </KitFoldCard>
      <KitFoldCard title="2.3: Alice's Identifier" class="mt-2" :open="false">
        <ul class="mb-2 ml-6 list-disc text-xs">
          <li>Compute Alice's Identifier <b><u>ZA</u></b> with <b><u>Key A</u></b> and <b><u>ID</u></b>.</li>
          <li>Send <b><u>QA</u></b>, <b><u>QX</u></b> and <b><u>ZA</u></b> to <b><u>Bob</u></b>.</li>
        </ul>
        <KitFormU8 v-model="alice.id" title="ID" :immediate="true" :codec="UTF8" />
        <KitFormU8 v-model="alice.di" title="ZA" :codec="HEX" />
      </KitFoldCard>
    </KitFoldCard>
    <KitFoldCard title="3: Bob's Components" :open="false">
      <KitFoldCard title="3.1: Bob's Key B" :open="false">
        <template #action>
          <KitButton @click="bob.clearX()">
            Clear
          </KitButton>
          <KitButton @click="bob.genX()">
            Generate
          </KitButton>
        </template>
        <ul class="mb-2 ml-6 list-disc text-xs">
          <li>Generate PrivateKey <b><u>dB</u></b>.</li>
          <li>Compute PublicKey <b><u>QB</u></b>.</li>
        </ul>
        <KitFormU8
          v-model="bob.key_x.d" :codec="HEX"
          :title="`dB (${bob.x_d_bit} bit)`"
        />
        <KitFormECCPoint
          v-model="bob.key_x.Q" :curve="curve"
          :x-bit="bob.x_x_bit" :y-bit="bob.x_y_bit"
          name="QB"
        />
      </KitFoldCard>
      <KitFoldCard title="3.2: Bob's Key Y" class="mt-2" :open="false">
        <template #action>
          <KitButton @click="bob.clearY()">
            Clear
          </KitButton>
          <KitButton @click="bob.genY()">
            Generate
          </KitButton>
        </template>
        <ul class="mb-2 ml-6 list-disc text-xs">
          <li>Generate PrivateKey <b><u>dY</u></b>.</li>
          <li>Compute PublicKey <b><u>QY</u></b>.</li>
        </ul>
        <KitFormU8
          v-model="bob.key_y.d" :codec="HEX"
          :title="`dY (${bob.y_d_bit} bit)`"
        />
        <KitFormECCPoint
          v-model="bob.key_y.Q" :curve="curve"
          :x-bit="bob.y_x_bit" :y-bit="bob.y_y_bit"
          name="QY"
        />
      </KitFoldCard>
      <KitFoldCard title="3.3: Bob's Identifier" class="mt-2" :open="false">
        <ul class="mb-2 ml-6 list-disc text-xs">
          <li>Compute Bob's Identifier <b><u>ZB</u></b> with <b><u>Key B</u></b> and <b><u>ID</u></b>.</li>
          <li>Send <b><u>QB</u></b>, <b><u>QY</u></b> and <b><u>ZB</u></b> to <b><u>Alice</u></b>.</li>
        </ul>
        <KitFormU8 v-model="bob.id" title="ID" :immediate="true" :codec="UTF8" />
        <KitFormU8 v-model="bob.di" title="ZB" :codec="HEX" />
      </KitFoldCard>
    </KitFoldCard>
    <KitFoldCard title="4: Shared Secret" :open="false">
      <template #action>
        <span class="hidden md:block" />
        <KitButton
          class="col-span-2 md:col-span-1"
          @click="dh()"
        >
          Compute
        </KitButton>
      </template>
      <KitFormU8
        v-model="alice.secret" :codec="HEX"
        :title="`Alice's Secret (${alice.secret_bit} bit)`" textarea
      />
      <KitFormU8
        v-model="bob.secret" :codec="HEX"
        :title="`Bob's Secret (${bob.secret_bit} bit)`" textarea
      />
    </KitFoldCard>
    <KitFoldCard title="Appendix: KDF" :open="false">
      <template #action>
        <span class="hidden md:block" />
        <KitButton
          class="col-span-2 md:col-span-1"
          @click="execKDF()"
        >
          Compute
        </KitButton>
      </template>
      <KitFormNumber v-model="k_bit" title="Output Key Size (bit)" />
      <KitFoldCard title="KDF Algorithm" class="mt-2">
        <KitFormSelectKDF v-model="kdf" class="w-full" />
      </KitFoldCard>
      <KitFormU8
        v-model="okm_a" :codec="HEX"
        :title="`KDF Alice (${okm_a.length} byte)`" textarea
      />
      <KitFormU8
        v-model="okm_b" :codec="HEX"
        :title="`KDF Bob (${okm_b.length} byte)`" textarea
      />
    </KitFoldCard>

    <!-- Curve Parameters -->
    <KitFoldCard title="Appendix: Curve Parameters" :open="false">
      <KitCurveTable :curve="curve" :codec="HEX" />
    </KitFoldCard>
  </ToolsLayout>
</template>
