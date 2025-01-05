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
  catchNotifySync(() => {
    alice.$reset();
    bob.$reset();
  }),
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
  <KitDivider class="divider-start">
    # Step 0: Choose Curve
  </KitDivider>
  <KitFormSelectCurve v-model="curve" title="" />
  <KitDivider class="divider-start">
    # Step 1: Alice
  </KitDivider>
  <div class="border-l px-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dA</u></b>.</li>
      <li>Compute <b><u>QA</u></b>.</li>
    </ul>
    <div class="flex justify-center gap-4 py-4">
      <KitButton @click="alice.clearX()">
        Clear
      </KitButton>
      <KitButton @click="alice.genX()">
        Generate
      </KitButton>
    </div>
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
  </div>
  <KitDivider class="divider-start">
    # Step 2: Alice
  </KitDivider>
  <div class="border-l px-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dX</u></b>.</li>
      <li>Compute <b><u>QX</u></b>.</li>
      <li>Send <b><u>QA</u></b> and <b><u>QX</u></b> to <b><u>Bob</u></b>.</li>
    </ul>
    <div class="flex justify-center gap-4 py-4">
      <KitButton @click="alice.clearY()">
        Clear
      </KitButton>
      <KitButton @click="alice.genY()">
        Generate
      </KitButton>
    </div>
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
  </div>
  <KitDivider class="divider-start">
    # Step 3: Bob
  </KitDivider>
  <div class="border-l px-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dB</u></b>.</li>
      <li>Compute <b><u>QB</u></b>.</li>
    </ul>
    <div class="flex justify-center gap-4 py-4">
      <KitButton @click="bob.clearX()">
        Clear
      </KitButton>
      <KitButton @click="bob.genX()">
        Generate
      </KitButton>
    </div>
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
  </div>
  <KitDivider class="divider-start">
    # Step 4: Bob
  </KitDivider>
  <div class="border-l px-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dY</u></b>.</li>
      <li>Compute <b><u>QY</u></b>.</li>
      <li>Send <b><u>QB</u></b> and <b><u>QY</u></b> to <b><u>Alice</u></b>.</li>
    </ul>
    <div class="flex justify-center gap-4 py-4">
      <KitButton @click="bob.clearY()">
        Clear
      </KitButton>
      <KitButton @click="bob.genY()">
        Generate
      </KitButton>
    </div>
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
  </div>
  <KitDivider class="divider-start">
    # Step 5: Compute Shared Secret
  </KitDivider>
  <div class="border-l px-4">
    <div class="flex justify-center gap-4 pb-4">
      <KitButton @click="alice.mqv(bob.key_x, bob.key_y), bob.mqv(alice.key_x, alice.key_y)">
        Compute Secret
      </KitButton>
    </div>
    <KitFormU8
      v-model="alice.secret"
      :codec="HEX"
      :title="`Alice's Secret (${alice.secret_bit} bit)`"
    />
    <KitFormU8
      v-model="bob.secret"
      :codec="HEX"
      :title="`Bob's Secret (${bob.secret_bit} bit)`"
    />
  </div>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
