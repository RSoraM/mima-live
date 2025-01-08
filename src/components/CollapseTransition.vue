<script setup lang="ts">
const transitionRef = ref<HTMLElement>();
const transition = computed(() => {
  const height = Number(
    transitionRef.value?.style.height.replace('px', '') ?? 0,
  );
  const unit = Math.ceil(height / 16);
  const duration = Math.max(unit * 25, 250);
  return `${duration}ms height ease-in-out, ${duration}ms padding-top ease-in-out, ${duration}ms padding-bottom ease-in-out`;
});
function beforeEnter(el?: HTMLElement) {
  if (!el)
    return;
  el.style.transition = transition.value;

  el.dataset.oldPaddingTop = el.style.paddingTop;
  el.dataset.oldPaddingBottom = el.style.paddingBottom;

  el.style.height = '0';
  el.style.paddingTop = '0';
  el.style.paddingBottom = '0';
}
function enter(el?: HTMLElement) {
  if (!el)
    return;
  el.dataset.oldOverflow = el.style.overflow;
  if (el.scrollHeight !== 0) {
    el.style.height = `${el.scrollHeight}px`;
    el.style.paddingTop = el.dataset.oldPaddingTop ?? '';
    el.style.paddingBottom = el.dataset.oldPaddingBottom ?? '';
  }
  else {
    el.style.height = '';
    el.style.paddingTop = el.dataset.oldPaddingTop ?? '';
    el.style.paddingBottom = el.dataset.oldPaddingBottom ?? '';
  }

  el.style.overflow = 'hidden';
}
function afterEnter(el?: HTMLElement) {
  if (!el)
    return;
  el.style.transition = '';
  el.style.height = '';
  el.style.overflow = el.dataset.oldOverflow ?? '';
}
function beforeLeave(el?: HTMLElement) {
  if (!el)
    return;
  el.dataset.oldOverflow = el.style.overflow;
  el.dataset.oldPaddingTop = el.style.paddingTop;
  el.dataset.oldPaddingBottom = el.style.paddingBottom;

  el.style.height = `${el.scrollHeight}px`;
  el.style.overflow = 'hidden';
}
function leave(el?: HTMLElement) {
  if (!el)
    return;
  if (el.scrollHeight !== 0) {
    el.style.transition = transition.value;
    el.style.height = '0';
    el.style.paddingTop = '0';
    el.style.paddingBottom = '0';
  }
}
function afterLeave(el?: HTMLElement) {
  if (!el)
    return;
  el.style.transition = '';
  el.style.height = '';
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
