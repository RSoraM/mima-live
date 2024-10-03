<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title || 'Mode' }}</span>
    </div>
    <select v-model="mode" class="select select-bordered">
      <option v-for="option in options" :key="option.name" :value="option.value">
        {{ option.name }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import { ecb, cbc, pcbc, cfb, ofb, ctr, gcm } from 'mima-kit'

defineOptions({
  name: 'KitFormModeSelect'
})
defineProps<{
  title?: string
}>()
const mode = defineModel()

interface Option {
  name: string
  value: Function
}
const options: Option[] = [
  {
    name: 'ECB',
    value: ecb,
  },
  {
    name: 'CBC',
    value: cbc,
  },
  {
    name: 'PCBC',
    value: pcbc,
  },
  {
    name: 'CFB',
    value: cfb,
  },
  {
    name: 'OFB',
    value: ofb,
  },
  {
    name: 'CTR',
    value: ctr,
  },
  {
    name: 'GCM',
    value: gcm,
  }
]
</script>
