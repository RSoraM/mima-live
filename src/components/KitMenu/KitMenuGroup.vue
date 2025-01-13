<script setup lang="ts">
defineOptions({ name: 'KitMenuGroup' });
const props = defineProps<{
  title: string;
  isOpen?: boolean;
}>();

const isOpenInside = ref(false);
watchEffect(() => {
  if (props.isOpen !== undefined) {
    isOpenInside.value = props.isOpen;
  }
});
</script>

<template>
  <li>
    <span
      :class="isOpenInside ? 'menu-dropdown-show' : ''"
      class="menu-dropdown-toggle"
      @click="isOpenInside = !isOpenInside"
    >
      <slot name="title">
        {{ title }}
      </slot>
    </span>
    <CollapseTransition>
      <ul
        v-show="isOpenInside"
        :class="isOpenInside ? 'menu-dropdown-show' : ''"
      >
        <slot />
      </ul>
    </CollapseTransition>
  </li>
</template>
