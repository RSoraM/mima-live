<script setup lang="ts">
defineOptions({ name: 'KitFoldCard' });

const {
  titlePrefix = '',
  title = '',
  titleSuffix = '',
  open = true,
  bodyClass = '',
} = defineProps<{
  titlePrefix?: string;
  title?: string;
  titleSuffix?: string;
  open?: boolean;
  bodyClass?: string;
}>();
const is_open = ref(open);
const body = ref<HTMLElement | null>(null);
onMounted(() => {
  const first_el = body.value?.firstElementChild;
  if (first_el?.tagName === 'LABEL' && first_el?.classList.contains('form-control')) {
    const first_label = first_el?.querySelector('.label');
    first_label?.classList.add('pt-0');
  }
  else if (first_el?.tagName === 'DIV' && first_el?.classList.contains('grid')) {
    const labels = first_el?.querySelectorAll('.label');
    labels?.forEach(label => label.classList.add('pt-0'));
  }
});
</script>

<template>
  <div>
    <!-- HEADER -->
    <div
      :class="{ 'rounded-t-box': is_open, 'rounded-box': !is_open, 'md:grid-cols-5': $slots.action }"
      class="grid grid-flow-row items-center bg-base-300 transition-all duration-500"
    >
      <!-- title -->
      <div
        :class="{ 'md:col-span-3': $slots.action }"
        class="flex w-full cursor-pointer items-center gap-2 p-4 text-sm font-bold md:pr-0"
        @click="is_open = !is_open"
      >
        <span class="swap swap-rotate" :class="{ 'swap-active': is_open }">
          <span class="swap-on icon-[carbon--subtract] size-4" />
          <span class="swap-off icon-[carbon--add] size-4" />
        </span>
        <slot name="title">
          {{ titlePrefix + title + titleSuffix }}
        </slot>
      </div>
      <!-- action -->
      <div
        v-if="$slots.action"
        class="grid grid-cols-2 gap-2 p-4 pt-0 md:col-span-2 md:p-0 md:pr-4"
      >
        <slot name="action" />
      </div>
    </div>
    <!-- BODY -->
    <CollapseTransition>
      <div
        v-show="is_open"
        class="origin-top rounded-b-box bg-base-300 bg-opacity-35"
      >
        <div ref="body" class="p-2 md:p-4" :class="bodyClass">
          <slot />
        </div>
      </div>
    </CollapseTransition>
  </div>
</template>
