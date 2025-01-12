<script setup lang="ts">
const transitionRef = ref<HTMLElement>();
const transition = computed(() => {
  // const height = Number(
  //   transitionRef.value?.style.height.replace('px', '') ?? 0,
  // );
  // const unit = Math.ceil(height / 16);
  const duration = 500;
  return `${duration}ms opacity, ${duration}ms max-height`;
});
function beforeEnter(el?: HTMLElement) {
  if (!el)
    return;
  el.style.transition = transition.value;
  // el.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';

  el.dataset.oldPaddingTop = el.style.paddingTop;
  el.dataset.oldPaddingBottom = el.style.paddingBottom;

  el.style.opacity = '0';
  el.style.maxHeight = '0';
  el.style.paddingTop = '0';
  el.style.paddingBottom = '0';
}
function enter(el?: HTMLElement) {
  if (!el)
    return;
  el.dataset.oldOverflow = el.style.overflow;
  if (el.scrollHeight !== 0) {
    el.style.opacity = '1';
    el.style.maxHeight = `${el.scrollHeight}px`;
    el.style.paddingTop = el.dataset.oldPaddingTop ?? '';
    el.style.paddingBottom = el.dataset.oldPaddingBottom ?? '';
  }
  else {
    el.style.opacity = '';
    el.style.maxHeight = '';
    el.style.paddingTop = el.dataset.oldPaddingTop ?? '';
    el.style.paddingBottom = el.dataset.oldPaddingBottom ?? '';
  }

  el.style.overflow = 'hidden';
}
function afterEnter(el?: HTMLElement) {
  if (!el)
    return;
  el.style.opacity = '';
  el.style.transition = '';
  // el.style.transitionTimingFunction = '';
  el.style.maxHeight = '';
  el.style.overflow = el.dataset.oldOverflow ?? '';
}
function beforeLeave(el?: HTMLElement) {
  if (!el)
    return;
  el.dataset.oldOverflow = el.style.overflow;
  el.dataset.oldPaddingTop = el.style.paddingTop;
  el.dataset.oldPaddingBottom = el.style.paddingBottom;

  el.style.opacity = '1';
  el.style.maxHeight = `${el.scrollHeight}px`;
  el.style.overflow = 'hidden';
}
function leave(el?: HTMLElement) {
  if (!el)
    return;
  if (el.scrollHeight !== 0) {
    el.style.transition = transition.value;
    // el.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
    el.style.opacity = '0';
    el.style.maxHeight = '0';
    el.style.paddingTop = '0';
    el.style.paddingBottom = '0';
  }
}
function afterLeave(el?: HTMLElement) {
  if (!el)
    return;
  el.style.transition = '';
  // el.style.transitionTimingFunction = '';
  el.style.opacity = '';
  el.style.maxHeight = '';
  el.style.overflow = el.dataset.oldOverflow ?? '';
  el.style.paddingTop = el.dataset.oldPaddingTop ?? '';
  el.style.paddingBottom = el.dataset.oldPaddingBottom ?? '';
}
</script>

<template>
  <Transition
    ref="transitionRef"
    @before-enter="beforeEnter(transitionRef)"
    @enter="enter(transitionRef)"
    @after-enter="afterEnter(transitionRef)"
    @before-leave="beforeLeave(transitionRef)"
    @leave="leave(transitionRef)"
    @after-leave="afterLeave(transitionRef)"
  >
    <slot />
  </Transition>
</template>
