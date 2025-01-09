<script setup lang="ts">
defineOptions({ name: 'KitStep' });
const { open = true } = defineProps<{
  num?: string;
  title?: string;
  open?: boolean;
  bodyClass?: string;
}>();

const is_open = ref(open);
</script>

<template>
  <KitDivider class="divider-start !gap-1">
    <label class="swap">
      <input v-model="is_open" type="checkbox">
      <span class="swap-on icon-[carbon--chevron-down] size-4" />
      <span class="swap-off icon-[carbon--chevron-right] size-4" />
    </label>
    <slot name="title">
      {{ num ? `${num}:` : '' }}
      {{ title }}
    </slot>
  </KitDivider>
  <CollapseTransition>
    <div v-show="is_open" class="pl-4" :class="bodyClass">
      <div v-if="$slots['action-top']" class="flex justify-end gap-4">
        <slot name="action-top" />
      </div>
      <slot />
      <div v-if="$slots.action" class="mt-4 flex justify-end gap-4">
        <slot name="action" />
      </div>
    </div>
  </CollapseTransition>
</template>
