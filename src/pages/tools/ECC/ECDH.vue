<script setup lang="ts">
import type { ECPublicKey } from 'mima-kit';

defineOptions({ name: 'ECDH' });

// Curve
const curve = ref(secp256r1);
const ec = computed(() => FpECC(curve.value));
// defineEntity
function defineEntity(name: string) {
  return defineStore(`ecdh-${name}`, () => {
    const key = ref({
      d: new U8(),
      Q: U8Point(),
    });
    const secret_dh = ref(new U8());
    const secret_cdh = ref(new U8());

    const $reset = () => {
      key.value = {
        d: new U8(),
        Q: U8Point(),
      };
      secret_dh.value = new U8();
      secret_cdh.value = new U8();
    };

    const d_bi = computed(() => key.value.d.toBI());
    const d_bit = computed(() => getBIBits(d_bi.value));
    const x_bi = computed(() => key.value.Q.x.toBI());
    const x_bit = computed(() => getBIBits(x_bi.value));
    const y_bi = computed(() => key.value.Q.y.toBI());
    const y_bit = computed(() => getBIBits(y_bi.value));
    const dh_bit = computed(() => getBIBits(secret_dh.value.toBI()));
    const cdh_bit = computed(() => getBIBits(secret_cdh.value.toBI()));
    const key_bi = computed(() => ({
      d: d_bi.value,
      Q: {
        isInfinity: key.value.Q.isInfinity,
        x: x_bi.value,
        y: y_bi.value,
      },
    }));

    const gen = () => {
      const k = ec.value.gen();
      key.value.d = k.d;
      key.value.Q = k.Q;
    };
    const dh = (pk: ECPublicKey) => {
      secret_dh.value = ec.value.dh(key_bi.value, pk).x;
    };
    const cdh = (pk: ECPublicKey) => {
      secret_cdh.value = ec.value.cdh(key_bi.value, pk).x;
    };
    return {
      key,
      key_bi,
      secret_dh,
      secret_cdh,
      d_bit,
      x_bit,
      y_bit,
      dh_bit,
      cdh_bit,
      $reset,
      gen,
      dh,
      cdh,
    };
  });
}
// Alice
const alice = defineEntity('alice')();
// Bob
const bob = defineEntity('bob')();

async function dh() {
  alice.dh(bob.key_bi);
  bob.dh(alice.key_bi);
}
async function cdh() {
  alice.cdh(bob.key_bi);
  bob.cdh(alice.key_bi);
}

// TODO add Appendix KDF

watch(
  curve,
  catchNotifySync(() => {
    alice.$reset();
    bob.$reset();
  }),
);

onMounted(async () => {
  alice.gen();
  bob.gen();
  alice.dh(bob.key_bi);
  bob.dh(alice.key_bi);
});
</script>

<template>
  <ToolsLayout title="ECDH / ECCDH">
    <KitFoldCard title="0: Elliptic Curve" :open="false">
      <KitFormSelectCurve v-model="curve" class="w-full" />
    </KitFoldCard>
    <KitFoldCard title="1: Alice's Key" :open="false">
      <template #action>
        <KitButton @click="alice.$reset()">
          Clear
        </KitButton>
        <KitButton @click="alice.gen()">
          Generate
        </KitButton>
      </template>
      <ul class="mb-2 ml-6 list-disc text-xs">
        <li>Generate PrivateKey <b><u>dA</u></b>.</li>
        <li>Compute and Send PublicKey <b><u>QA</u></b> to <b><u>Bob</u></b>.</li>
      </ul>
      <KitFormU8
        v-model="alice.key.d" :codec="HEX"
        :title="`dA (${alice.d_bit} bit)`"
      />
      <KitFormECCPoint
        v-model="alice.key.Q" :curve="curve"
        :x-bit="alice.x_bit" :y-bit="alice.y_bit"
        name="QA"
      />
    </KitFoldCard>
    <KitFoldCard title="2: Bob's Key" :open="false">
      <template #action>
        <KitButton @click="bob.$reset()">
          Clear
        </KitButton>
        <KitButton @click="bob.gen()">
          Generate
        </KitButton>
      </template>
      <ul class="mb-2 ml-6 list-disc text-xs">
        <li>Generate PrivateKey <b><u>dB</u></b>.</li>
        <li>Compute and Send PublicKey <b><u>QB</u></b> to <b><u>Alice</u></b>.</li>
      </ul>
      <KitFormU8
        v-model="bob.key.d" :codec="HEX"
        :title="`dB (${bob.d_bit} bit)`"
      />
      <KitFormECCPoint
        v-model="bob.key.Q" :curve="curve"
        :x-bit="bob.x_bit" :y-bit="bob.y_bit"
        name="QB"
      />
    </KitFoldCard>
    <KitFoldCard title="3: Shared Secret" :open="false">
      <template #action>
        <span class="hidden md:block" />
        <KitButton class="col-span-2 md:col-span-1" @click="dh()">
          Compute
        </KitButton>
      </template>
      <KitFormU8
        v-model="alice.secret_dh" :codec="HEX"
        :title="`Alice's Secret (${alice.dh_bit} bit)`"
      />
      <KitFormU8
        v-model="bob.secret_dh" :codec="HEX"
        :title="`Bob's Secret (${bob.dh_bit} bit)`"
      />
    </KitFoldCard>
    <KitFoldCard title="Appendix: ECCDH Result" :open="false">
      <template #action>
        <span class="hidden md:block" />
        <KitButton class="col-span-2 md:col-span-1" @click="cdh()">
          Compute
        </KitButton>
      </template>
      <KitFormU8
        v-model="alice.secret_cdh" :codec="HEX"
        :title="`Alice's Secret = dA * QB * h (${alice.cdh_bit} bit)`"
      />
      <KitFormU8
        v-model="bob.secret_cdh" :codec="HEX"
        :title="`Bob's Secret = dB * QA * h (${bob.cdh_bit} bit)`"
      />
    </KitFoldCard>

    <!-- Curve Parameters -->
    <KitFoldCard title="Appendix: Curve Parameters" :open="false">
      <KitCurveTable :curve="curve" :codec="HEX" />
    </KitFoldCard>
  </ToolsLayout>
</template>
