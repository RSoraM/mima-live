<script setup lang="ts">
import { cbc, cfb, ctr, ecb, gcm, ofb, pcbc } from 'mima-kit';

defineOptions({ name: 'KitFormModeSelect' });
defineProps<{ title?: string }>();
const mode = defineModel();

const options: SelectOption[] = [
  { label: 'ECB', value: ecb },
  { label: 'CBC', value: cbc },
  { label: 'PCBC', value: pcbc },
  { label: 'CFB', value: cfb },
  { label: 'OFB', value: ofb },
  { label: 'CTR', value: ctr },
  { label: 'GCM', value: gcm },
];
</script>

<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title || 'Mode' }}</span>
    </div>
    <select v-model="mode" class="select select-bordered">
      <option
        v-for="option in options" :key="option.label"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
