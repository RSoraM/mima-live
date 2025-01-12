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
  alice.mqv(bob.key_x, bob.key_y);
  bob.mqv(alice.key_x, alice.key_y);
}

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
  <ToolsLayout title="ECMQV">
    <KitFoldCard title="0: Elliptic Curve" :open="false">
      <KitFormSelectCurve v-model="curve" class="w-full" />
    </KitFoldCard>
    <KitFoldCard title="1: Alice's Components" :open="false">
      <KitFoldCard title="1.1: Alice's Key A" :open="false">
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
      </KitFoldCard>
      <KitFoldCard title="1.2: Alice's Key X" class="mt-2" :open="false">
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
      </KitFoldCard>
    </KitFoldCard>
    <KitFoldCard title="2: Bob's Components" :open="false">
      <KitFoldCard title="2.1: Bob's Key B" :open="false">
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
      </KitFoldCard>
      <KitFoldCard title="2.2: Bob's Key Y" class="mt-2" :open="false">
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
      </KitFoldCard>
    </KitFoldCard>
    <KitFoldCard title="3: Shared Secret" :open="false">
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
        :title="`Alice's Secret (${alice.secret_bit} bit)`"
      />
      <KitFormU8
        v-model="bob.secret" :codec="HEX"
        :title="`Bob's Secret (${bob.secret_bit} bit)`"
      />
    </KitFoldCard>
    <KitFoldCard title="Appendix: KDF" :open="false">
      <KitFoldCard title="0: Output Key Size (bit)" :open="false">
        <KitFormNumber v-model="k_bit" :step="8" class="w-full" />
      </KitFoldCard>
      <KitFoldCard title="1: KDF Algorithm" class="mt-2" :open="false">
        <KitFormSelectKDF v-model="kdf" title-prefix="1." class="w-full" />
      </KitFoldCard>
      <KitFoldCard title="2: ECMQV KDF" class="mt-2" :open="false">
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
