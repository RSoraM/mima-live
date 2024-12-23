<template>
  <details class="collapse collapse-plus">
    <summary class="collapse-title text-lg font-bold">
      <slot name="header" />
    </summary>
    <div class="collapse-content">
      <slot />
    </div>
  </details>
</template>
