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
  <KitStep num="0" title="Choose Curve">
    <KitFormSelectCurve v-model="curve" :options="options" title="" class="w-full" />
  </KitStep>
  <KitStep num="1" title="Alice">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dA</u></b>.</li>
      <li>Compute and Send PublicKey <b><u>QA</u></b> to <b><u>Bob</u></b>.</li>
    </ul>
    <KitFormU8 v-model="alice.key.d" :codec="HEX" title="dA" />
    <KitFormU8 v-model="alice.key.Q" :codec="HEX" title="QA" />
    <template #action>
      <KitButton @click="alice.$reset()">
        Clear
      </KitButton>
      <KitButton @click="alice.gen()">
        Generate
      </KitButton>
    </template>
  </KitStep>
  <KitStep num="2" title="Bob">
    <ul class="mx-8 list-decimal text-sm">
      <li>Generate PrivateKey <b><u>dB</u></b>.</li>
      <li>Compute and Send PublicKey <b><u>QB</u></b> to <b><u>Alice</u></b>.</li>
    </ul>
    <KitFormU8 v-model="bob.key.d" :codec="HEX" title="dB" />
    <KitFormU8 v-model="bob.key.Q" :codec="HEX" title="QB" />
    <template #action>
      <KitButton @click="bob.$reset()">
        Clear
      </KitButton>
      <KitButton @click="bob.gen()">
        Generate
      </KitButton>
    </template>
  </KitStep>
  <KitStep num="3" title="Compute Shared Secret">
    <KitFormU8 v-model="alice.secret" :codec="HEX" :title="`Alice's Secret = dA * QB (${alice.secretBit} bit)`" />
    <KitFormU8 v-model="bob.secret" :codec="HEX" :title="`Bob's Secret = dB * QA (${bob.secretBit} bit)`" />
    <template #action>
      <KitButton @click="alice.dh(bob.key), bob.dh(alice.key)">
        Compute Secret
      </KitButton>
    </template>
  </KitStep>

  <KitAlert class="mt-4">
    <b><u>x25519</u></b> and <b><u>x448</u></b> provided by <b><u>mima-kit</u></b> may not be fully compatible with other implementations.
    This is because <b><u>RFC 7748</u></b> specifies <b><u>little-endian</u></b> as the encoding method,
    while <b><u>mima-kit</u></b> uses <b><u>big-endian</u></b> as the encoding method.
    By converting the <b><u>endian</u></b>, it should be compatible with other implementations.
  </KitAlert>

  <!-- Curve Parameters -->
  <KitDivider>
    Curve Parameters
  </KitDivider>
  <KitCurveTable :curve="curve" :codec="HEX" />
</template>
