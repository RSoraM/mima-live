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

const kdf = ref(x963kdf(sha256));
const k_bit = ref(256);
const okm_a = ref(new U8());
const okm_b = ref(new U8());
function execKDF() {
  dh();
  okm_a.value = kdf.value(k_bit.value, alice.secret);
  okm_b.value = kdf.value(k_bit.value, bob.secret);
}

function dh() {
  alice.dh(bob.key);
  bob.dh(alice.key);
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
  alice.dh(bob.key);
  bob.dh(alice.key);
});
</script>

<template>
  <ToolsLayout :title="curve === curve25519 ? 'X25519' : 'X448'">
    <KitAlert>
      <b><u>x25519</u></b> and <b><u>x448</u></b> provided by <b><u>mima-kit</u></b> may not be fully compatible with other implementations.
      This is because <b><u>RFC 7748</u></b> specifies <b><u>little-endian</u></b> as the encoding method,
      while <b><u>mima-kit</u></b> uses <b><u>big-endian</u></b> as the encoding method.
      By converting the <b><u>endian</u></b>, it should be compatible with other implementations.
    </KitAlert>
    <KitFoldCard title="0: Elliptic Curve" :open="false">
      <KitFormSelectCurve v-model="curve" :options="options" class="w-full" />
    </KitFoldCard>
    <KitFoldCard title="1: Alice's Key" :open="false">
      <ul class="mb-2 ml-6 list-disc text-xs">
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
      <KitFormU8 v-model="bob.key.d" :codec="HEX" title="dB" />
      <KitFormU8 v-model="bob.key.Q" :codec="HEX" title="QB" />
    </KitFoldCard>
    <KitFoldCard title="3: Shared Secret" :open="false">
      <template #action>
        <span class="hidden md:block" />
        <KitButton
          class="col-span-2 md:col-span-1"
          @click="alice.dh(bob.key), bob.dh(alice.key)"
        >
          Compute
        </KitButton>
      </template>
      <KitFormU8 v-model="alice.secret" :codec="HEX" :title="`Alice's Secret = dA * QB (${alice.secretBit} bit)`" />
      <KitFormU8 v-model="bob.secret" :codec="HEX" :title="`Bob's Secret = dB * QA (${bob.secretBit} bit)`" />
    </KitFoldCard>
    <KitFoldCard title="Appendix: KDF" :open="false">
      <KitFoldCard title="0: Output Key Size (bit)" :open="false">
        <KitFormNumber v-model="k_bit" :step="8" class="w-full" />
      </KitFoldCard>
      <KitFoldCard title="1: KDF Algorithm" class="mt-2" :open="false">
        <KitFormSelectKDF v-model="kdf" title-prefix="1." class="w-full" />
      </KitFoldCard>
      <KitFoldCard title="2: X25519 KDF" class="mt-2" :open="false">
        <template #action>
          <span class="hidden md:block" />
          <KitButton class="col-span-2 md:col-span-1" @click="execKDF()">
            Compute
          </KitButton>
        </template>
        <KitFormU8
          v-model="okm_a" :codec="HEX"
          :title="`KDF Alice (${okm_a.length} byte)`" textarea
        />
        <KitFormU8
          v-model="okm_b" :codec="HEX"
          :title="`KDF Bob (${okm_b.length} byte)`" textarea
        />
      </KitFoldCard>
    </KitFoldCard>

    <!-- Curve Parameters -->
    <KitFoldCard title="Appendix: Curve Parameters" :open="false">
      <KitCurveTable :curve="curve" :codec="HEX" />
    </KitFoldCard>
  </ToolsLayout>
</template>
