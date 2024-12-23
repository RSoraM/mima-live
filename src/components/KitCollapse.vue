<template>
  <details class="collapse collapse-plus">
    <summary class="collapse-title min-h-0 text-sm font-bold">
      <slot name="header" />
    </summary>
    <div class="collapse-content">
      <slot />
    </div>
  </details>
</template>
