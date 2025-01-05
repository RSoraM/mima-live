<script setup lang="ts">
defineOptions({ name: 'X25519DH' });

// Curve
const curve = ref(curve25519);
const options: SelectOption[] = [
  { label: 'Curve 25519', value: curve25519 },
  { label: 'Curve 448', value: curve448 },
];
const ec = computed(() => curve.value === curve25519 ? x25519 : x448);
// defineEntity
function defineEntity(name: string) {
  return defineStore(`x25519-key-${name}`, {
    state: () => ({
      key: {
        d: new U8(),
        Q: new U8(),
      },
      secret: new U8(),
    }),
    getters: {
      secretBit(state) {
        return getBIBits(state.secret.toBI());
      },
    },
    actions: {
      gen() {
        this.$reset();
        this.key = ec.value.gen();
      },
      dh(pk: typeof this.key) {
        this.secret = catchNotifySync(
          () => ec.value.dh(this.key, pk),
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
  alice.dh(bob.key);
  bob.dh(alice.key);
});
</script>

<template>
  <h1 class="mx-auto mb-8 text-4xl font-bold md:my-8">
    {{ curve === curve25519 ? 'X25519' : 'X448' }}
  </h1>
  <KitDivider class="divider-start">
    # Step 0: Choose Curve
  </KitDivider>
  <KitFormSelectCurve v-model="curve" :options="options" title="" />
  <KitDivider class="divider-start">
    # Step 1: Alice
  </KitDivider>
  <div class="border-l px-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dA</u></b>.</li>
      <li>Compute and Send PublicKey <b><u>QA</u></b> to <b><u>Bob</u></b>.</li>
    </ul>
    <div class="flex justify-center gap-4 py-4">
      <KitButton @click="alice.$reset()">
        Clear
      </KitButton>
      <KitButton @click="alice.gen()">
        Generate
      </KitButton>
    </div>
    <KitFormU8
      v-model="alice.key.d"
      :codec="HEX"
      title="dA"
    />
    <KitFormU8
      v-model="alice.key.Q"
      :codec="HEX"
      title="QA"
    />
  </div>
  <KitDivider class="divider-start">
    # Step 2: Bob
  </KitDivider>
  <div class="border-l px-4">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dB</u></b>.</li>
      <li>Compute and Send PublicKey <b><u>QB</u></b> to <b><u>Alice</u></b>.</li>
    </ul>
    <div class="flex justify-center gap-4 py-4">
      <KitButton @click="bob.$reset()">
        Clear
      </KitButton>
      <KitButton @click="bob.gen()">
        Generate
      </KitButton>
    </div>
    <KitFormU8
      v-model="bob.key.d"
      :codec="HEX"
      title="dB"
    />
    <KitFormU8
      v-model="bob.key.Q"
      :codec="HEX"
      title="QB"
    />
  </div>
  <KitDivider class="divider-start">
    # Step 3: Compute Shared Secret
  </KitDivider>
  <div class="border-l px-4">
    <div class="flex justify-center gap-4 pb-4">
      <KitButton @click="alice.dh(bob.key), bob.dh(alice.key)">
        Compute Secret
      </KitButton>
    </div>
    <KitFormU8
      v-model="alice.secret"
      :codec="HEX"
      :title="`Alice's Secret = dA * QB (${alice.secretBit} bit)`"
    />
    <KitFormU8
      v-model="bob.secret"
      :codec="HEX"
      :title="`Bob's Secret = dB * QA (${bob.secretBit} bit)`"
    />
  </div>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
