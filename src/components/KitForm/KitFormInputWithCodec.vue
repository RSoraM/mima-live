<script setup lang="ts">
import type { Codec } from 'mima-kit';
import { B64, B64URL, CSV, HEX, UTF8 } from 'mima-kit';

defineOptions({ name: 'KitFormInputWithCodec' });
defineProps<{ title?: string }>();
const text = defineModel<string>('text');
const codec = defineModel<Codec>('codec');

const options: SelectOption<Codec>[] = [
  { label: 'UTF-8', value: UTF8 },
  { label: 'HEX', value: HEX },
  { label: 'Base64', value: B64 },
  { label: 'Base64URL', value: B64URL },
  { label: 'Core Values', value: CSV },
];
</script>

<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title }}</span>
    </div>
    <div class="join">
      <select v-model="codec" class="join-item select select-bordered text-xs">
        <option
          v-for="option in options" :key="option.label"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <input v-model="text" type="text" class="input join-item input-bordered w-full text-xs">
    </div>
  </label>
</template>
