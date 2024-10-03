<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title || 'Codec' }}</span>
    </div>
    <select v-model="codec" class="select select-bordered">
      <option v-for="option in options" :key="option.name" :value="option.value">
        {{ option.name }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import type { Codec } from 'mima-kit';
import { UTF8, HEX, B64, B64URL, CSV } from 'mima-kit'

defineOptions({
  name: 'KitFormCodecSelect'
})
defineProps<{
  title?: string
}>()
const codec = defineModel()

interface Option {
  name: string
  value: Codec
}
const options: Option[] = [
  {
    name: 'UTF-8',
    value: UTF8,
  },
  {
    name: 'HEX',
    value: HEX,
  },
  {
    name: 'Base64',
    value: B64,
  },
  {
    name: 'Base64URL',
    value: B64URL,
  },
  {
    name: 'Core Socialist Values',
    value: CSV,
  }
]
</script>
