<script setup lang="ts">
const currentTheme = useLocalStorage('theme', 'dark');
</script>

<template>
  <div class="hero min-h-screen bg-base-200 font-mono">
    <div class="hero-content flex-col text-center">
      <img class="mx-auto w-36 select-none" src="/logo.svg">
      <h1 class="items-center text-4xl font-bold">
        mima-live
      </h1>
      <p>
        Cryptography tool based on
        <br>
        <a class="link" href="https://github.com/RSoraM/mima-kit" target="_blank">
          mima-kit
        </a>
      </p>
      <RouterLink to="/tools/Hash/SM3">
        <button class="btn btn-outline">
          Play with mima-kit
        </button>
      </RouterLink>
      <div class="flex items-center justify-center gap-4">
        <a href="https://github.com/RSoraM/mima-live" target="_blank">
          <span class="icon-[carbon--logo-github] size-8" />
        </a>
        <span>
          Make with 💗 by
          <a class="link" href="https://github.com/RSoraM" target="_blank">
            @RSoraM
          </a>
        </span>
      </div>
    </div>
  </div>
  <input
    v-model="currentTheme"
    type="radio" class="theme-controller hidden" name="theme"
    :value="currentTheme"
  >
</template>
