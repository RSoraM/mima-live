<template>
  <div class="w-dvw h-dvh flex">
    <div class="hidden md:flex w-56 overflow-y-auto bg-base-200">
      <TheKitMenu />
    </div>
    <div class="flex flex-col h-dvh overflow-y-scroll w-full">
      <!-- Open the modal using ID.showModal() method -->
      <button class="md:hidden btn btn-lg btn-primary mx-8 my-8" onclick="theKitMenu.showModal()">Menu</button>
      <dialog id="theKitMenu" class="modal">
        <div class="modal-box h-full">
          <form method="dialog" class="flex items-center">
            <button class="btn mx-auto">Close</button>
          </form>
          <TheKitMenu />
        </div>
      </dialog>
      <RouterView class="flex flex-col max-w-md w-full mx-auto p-4"></RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
