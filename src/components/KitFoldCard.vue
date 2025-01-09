<script setup lang="ts">
defineOptions({ name: 'KitFoldCard' });
const { open = false } = defineProps<{
  open?: boolean;
  title?: string;
}>();

const is_open = ref(open);
</script>

<template>
  <div class="rounded-box bg-base-200 text-sm">
    <div
      class="flex cursor-pointer justify-between p-4"
      @click="is_open = !is_open"
    >
      <slot name="header">
        {{ title }}
      </slot>
      <label class="swap">
        <input v-model="is_open" type="checkbox">
        <span class="swap-on icon-[carbon--chevron-down] size-4" />
        <span class="swap-off icon-[carbon--chevron-right] size-4" />
      </label>
    </div>
    <CollapseTransition>
      <div v-show="is_open" class="p-4 pt-0">
        <slot />
        <div
          v-if="$slots.action"
          class="mt-4 flex justify-end gap-4"
        >
          <slot name="action" />
        </div>
      </div>
    </CollapseTransition>
  </div>
</template>
