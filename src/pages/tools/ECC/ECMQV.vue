<script setup lang="ts">
defineOptions({ name: 'ECMQV' });

// Curve
const curve = ref(secp256r1);
const ec = computed(() => FpECC(curve.value));
// defineEntity
function defineEntity(name: string) {
  return defineStore(`ecmqv-${name}`, {
    state: () => ({
      key_x: {
        d: new U8(),
        Q: U8Point(),
      },
      key_y: {
        d: new U8(),
        Q: U8Point(),
      },
      secret: new U8(),
    }),
    getters: {
      x_d_bit(state) {
        return getBIBits(state.key_x.d.toBI());
      },
      x_x_bit(state) {
        return getBIBits(state.key_x.Q.x.toBI());
      },
      x_y_bit(state) {
        return getBIBits(state.key_x.Q.y.toBI());
      },
      y_d_bit(state) {
        return getBIBits(state.key_y.d.toBI());
      },
      y_x_bit(state) {
        return getBIBits(state.key_y.Q.x.toBI());
      },
      y_y_bit(state) {
        return getBIBits(state.key_y.Q.y.toBI());
      },
      secret_bit(state) {
        return getBIBits(state.secret.toBI());
      },
    },
    actions: {
      gen() {
        this.secret = new U8();
        this.key_x = ec.value.gen();
        this.key_y = ec.value.gen();
      },
      genX() {
        this.secret = new U8();
        this.key_x = ec.value.gen();
      },
      genY() {
        this.secret = new U8();
        this.key_y = ec.value.gen();
      },
      clearX() {
        this.key_x = { d: new U8(), Q: U8Point() };
      },
      clearY() {
        this.key_y = { d: new U8(), Q: U8Point() };
      },
      mqv(key_a: typeof this.key_x, key_b: typeof this.key_x) {
        this.secret = catchNotifySync(
          () => ec.value.mqv(this.key_x, this.key_y, key_a, key_b).x,
        )();
      },
    },
  });
}
// Alice
const alice = defineEntity('alice')();
// Bob
const bob = defineEntity('bob')();

watch(
  curve,
  () => {
    alice.$reset();
    bob.$reset();
  },
);
onMounted(async () => {
  alice.gen();
  bob.gen();
  alice.mqv(bob.key_x, bob.key_y);
  bob.mqv(alice.key_x, alice.key_y);
});
</script>

<template>
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    ECMQV
  </h1>
  <KitStep num="0" title="Choose Curve">
    <KitFormSelectCurve v-model="curve" title="" class="w-full" />
  </KitStep>
  <KitStep num="1" title="Alice">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dA</u></b>.</li>
      <li>Compute <b><u>QA</u></b>.</li>
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
    <template #action>
      <KitButton @click="alice.clearX()">
        Clear
      </KitButton>
      <KitButton @click="alice.genX()">
        Generate
      </KitButton>
    </template>
  </KitStep>
  <KitStep num="2" title="Alice">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dX</u></b>.</li>
      <li>Compute <b><u>QX</u></b>.</li>
      <li>Send <b><u>QA</u></b> and <b><u>QX</u></b> to <b><u>Bob</u></b>.</li>
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
    <template #action>
      <KitButton @click="alice.clearY()">
        Clear
      </KitButton>
      <KitButton @click="alice.genY()">
        Generate
      </KitButton>
    </template>
  </KitStep>
  <KitStep num="3" title="Bob">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dB</u></b>.</li>
      <li>Compute <b><u>QB</u></b>.</li>
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
    <template #action>
      <KitButton @click="bob.clearX()">
        Clear
      </KitButton>
      <KitButton @click="bob.genX()">
        Generate
      </KitButton>
    </template>
  </KitStep>
  <KitStep num="4" title="Bob">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dY</u></b>.</li>
      <li>Compute <b><u>QY</u></b>.</li>
      <li>Send <b><u>QB</u></b> and <b><u>QY</u></b> to <b><u>Alice</u></b>.</li>
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
    <template #action>
      <KitButton @click="bob.clearY()">
        Clear
      </KitButton>
      <KitButton @click="bob.genY()">
        Generate
      </KitButton>
    </template>
  </KitStep>
  <KitStep num="5" title="Compute Shared Secret">
    <KitFormU8
      v-model="alice.secret" :codec="HEX"
      :title="`Alice's Secret (${alice.secret_bit} bit)`"
    />
    <KitFormU8
      v-model="bob.secret" :codec="HEX"
      :title="`Bob's Secret (${bob.secret_bit} bit)`"
    />
    <template #action>
      <KitButton @click="alice.mqv(bob.key_x, bob.key_y), bob.mqv(alice.key_x, alice.key_y)">
        Compute Secret
      </KitButton>
    </template>
  </KitStep>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
