<script setup lang="ts">
defineOptions({ name: 'TOTP' });

const hash = ref(sha1);
const mac = computed(() => hmac(hash.value));

const K = ref(UTF8('mima-kit'));
const OTP = ref('');

const Es = ref(0)

const T = useTimestamp({ interval: 100 });
const Ts = computed(() => Math.floor(T.value / 1000));
const using_CTs = ref(false);
const CTs = ref(0)

const Xs = ref(30)
const d = ref(6)

const CDs = computed(() => {
  const t = using_CTs.value
    ? CTs.value - Es.value
    : Ts.value - Es.value
  return Xs.value - (t % Xs.value);
})

watchEffect(() => {
  OTP.value = totp({
    mac: mac.value,
    current: using_CTs.value ? CTs.value : Ts.value,
    epoch: Es.value,
    step: Xs.value,
    digits: d.value,
  })(K.value)
})

onMounted(() => hash.value = sha1); // Default to SHA-1 for TOTP
</script>

<template>
  <ToolsLayout title="TOTP">
    <template #body>
      <KitFormSelectHash v-model="hash" :title="`HMAC-${hash.ALGORITHM}`" />
      <KitFoldCard title="TOTP Config" class="mt-2" :open="false">
        <KitFormNumber v-model="Es" title="Epoch" :min="0" />
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">using custom timestamp</span>
            <input v-model="using_CTs" type="checkbox" class="checkbox" />
          </label>
        </div>
        <template v-if="using_CTs">
          <KitFormNumber v-model="CTs" title="Custom Timestamp (s)" :min="0" v-if="using_CTs" />
        </template>
        <br>
        <KitFormNumber v-model="Xs" title="Time Step (s)" :min="1" />
        <KitFormNumber v-model="d" title="Digits" :min="1" :max="10" />
      </KitFoldCard>
      <KitFormU8 v-model="K" title="Key" :immediate="true" :codec="B32" />

      <div class="flex flex-col items-center my-4 text-sm" :class="{ 'line-through': using_CTs }">
        <span>Current Timestamp (s):</span>
        <span class="font-bold">{{ Ts }}</span>
      </div>

      <div class="flex items-center justify-center my-8 text-6xl font-bold tracking-widest">
        {{ OTP }}
      </div>
      <div class="flex items-center gap-2">
        <progress class="progress" :value="CDs" :max="Xs"></progress>
        <span class="countdown font-mono">
          <span :style="`--value:${CDs};`"></span>
        </span>
      </div>
    </template>
    <template #stat>
      <KitStat title="Specification">
        <KitRefLink :texts="['RFC 6238']" icon="icon-[carbon--txt-reference]"
          href="https://www.rfc-editor.org/rfc/rfc6238.txt" />
      </KitStat>
      <KitStat title="First published">
        2011
      </KitStat>
      <KitStat title="Recommended key size (byte)">
        {{ mac?.KEY_SIZE }}
      </KitStat>
    </template>
  </ToolsLayout>
</template>
