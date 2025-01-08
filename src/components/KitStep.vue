<script setup lang="ts">
defineOptions({ name: 'KitStep' });
const { num = '0', open = true } = defineProps<{
  num?: string;
  title?: string;
  open?: boolean;
}>();

const is_open = ref(open);
</script>

<template>
  <KitDivider class="divider-start !gap-1">
    <label class="swap swap-rotate">
      <input v-model="is_open" type="checkbox">
      <span class="swap-on icon-[carbon--subtract] size-4" />
      <span class="swap-off icon-[carbon--add] size-4" />
    </label>
    # {{ num }}: {{ title }}
  </KitDivider>
  <CollapseTransition>
    <div v-show="is_open" class="pl-4">
      <slot />
      <div v-if="$slots.action" class="mt-4 flex justify-end gap-4">
        <slot name="action" />
      </div>
    </div>
  </CollapseTransition>
</template>
