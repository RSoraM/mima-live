<template>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">{{ title }}</span>
    </div>
    <div class="join">
      <select v-model="codec" class="select select-bordered join-item">
        <option v-for="option in options" :key="option.name" :value="option.value">
          {{ option.name }}
        </option>
      </select>
      <input type="text" v-model="text" class="input input-bordered join-item w-full" />
    </div>
  </label>
</template>

<script setup lang="ts">
import type { Codec } from 'mima-kit';
import { UTF8, HEX, B64, B64URL, CSV } from 'mima-kit'

defineOptions({
  name: 'KitFormInputWithCodec',
})
defineProps<{
  title?: string
}>()
const text = defineModel<string>('text')
const codec = defineModel<Codec>('codec')

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
    name: 'Core Values',
    value: CSV,
  }
]
</script>
