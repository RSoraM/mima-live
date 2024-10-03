<template>
  <li>
    <span class="menu-dropdown-toggle" @click="isOpenInside = !isOpenInside">
      {{ title }}
    </span>
    <ul class="menu-dropdown" :class="isOpenInside ? 'menu-dropdown-show' : ''">
      <slot />
    </ul>
  </li>
</template>

<script setup lang="ts">
defineOptions({
  name: 'KitMenuGroup',
})
const props = defineProps<{
  title: string,
  isOpen?: boolean
}>()
const isOpenInside = ref(false)
watchEffect(() => {
  if (props.isOpen !== undefined) {
    isOpenInside.value = props.isOpen
  }
})
</script>
