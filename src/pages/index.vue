<template>
  <div class="hero min-h-screen bg-base-200 font-mono">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <img
          class="mx-auto my-4 w-36"
          src="/logo.svg"
        >
        <h1 class="text-4xl font-bold">
          mima-live
        </h1>
        <p class="py-6">
          An online cryptography tool based on mima-kit
        </p>
        <RouterLink to="/tools">
          <button class="btn btn-outline">
            Play with mima-kit
          </button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
