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
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    ECDH / ECCDH
  </h1>
  <KitDivider class="divider-start">
    # Step 0: Choose Curve
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormSelectCurve v-model="curve" title="" class="w-full" />
  </div>
  <KitDivider class="divider-start">
    # Step 1: Alice
  </KitDivider>
  <div class="border-l pl-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dA</u></b>.</li>
      <li>Compute and Send PublicKey <b><u>QA</u></b> to <b><u>Bob</u></b>.</li>
    </ul>
    <KitFormU8
      v-model="alice.key.d"
      :codec="HEX"
      :title="`dA (${alice.d_bit} bit)`"
    />
    <KitFormECCPoint
      v-model="alice.key.Q"
      :curve="curve"
      name="QA"
      :x-bit="alice.x_bit"
      :y-bit="alice.y_bit"
    />
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="alice.$reset()">
        Clear
      </KitButton>
      <KitButton @click="alice.gen()">
        Generate
      </KitButton>
    </div>
  </div>
  <KitDivider class="divider-start">
    # Step 2: Bob
  </KitDivider>
  <div class="border-l pl-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dB</u></b>.</li>
      <li>Compute and Send PublicKey <b><u>QB</u></b> to <b><u>Alice</u></b>.</li>
    </ul>
    <KitFormU8
      v-model="bob.key.d"
      :codec="HEX"
      title="dB"
    />
    <KitFormECCPoint
      v-model="bob.key.Q"
      :curve="curve"
      name="QB"
      :x-bit="bob.x_bit"
      :y-bit="bob.y_bit"
    />
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="bob.$reset()">
        Clear
      </KitButton>
      <KitButton @click="bob.gen()">
        Generate
      </KitButton>
    </div>
  </div>
  <KitDivider class="divider-start">
    # Step 3: Compute Shared Secret
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormU8
      v-model="alice.secret_dh"
      :codec="HEX"
      :title="`Alice's Secret = dA * QB (${alice.dh_bit} bit)`"
    />
    <KitFormU8
      v-model="bob.secret_dh"
      :codec="HEX"
      :title="`Bob's Secret = dB * QA (${bob.dh_bit} bit)`"
    />
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="dh()">
        Compute Secret
      </KitButton>
    </div>
  </div>
  <KitDivider class="divider-start">
    # Appendix: ECCDH Result
  </KitDivider>
  <div class="border-l pl-4">
    <KitFormU8
      v-model="alice.secret_cdh"
      :codec="HEX"
      :title="`Alice's Secret = dA * QB * h (${alice.cdh_bit} bit)`"
    />
    <KitFormU8
      v-model="bob.secret_cdh"
      :codec="HEX"
      :title="`Bob's Secret = dB * QA * h (${bob.cdh_bit} bit)`"
    />
    <div class="flex justify-end gap-4 py-4">
      <KitButton @click="cdh()">
        Compute Secret
      </KitButton>
    </div>
  </div>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
