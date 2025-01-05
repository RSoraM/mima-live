export const useECCKey = defineStore('ecc-key', () => {
  const curve = ref<typeof secp256r1 | typeof curve25519>(secp256r1);
  const ec = computed(() => FpECC(curve.value));

  const d = ref(new U8());
  const Q = ref(U8Point());

  const d_bit = computed(() => getBIBits(d.value.toBI()));
  const x_bit = computed(() => getBIBits(Q.value.x.toBI()));
  const y_bit = computed(() => getBIBits(Q.value.y.toBI()));

  const gen = () => {
    const key = ec.value.gen();
    d.value = key.d;
    Q.value = key.Q;
  };
  const $reset = () => {
    d.value = new U8();
    Q.value = U8Point();
  };

  watch(curve, $reset);

  return {
    curve,
    d,
    Q,
    d_bit,
    x_bit,
    y_bit,
    gen,
    $reset,
  };
});
