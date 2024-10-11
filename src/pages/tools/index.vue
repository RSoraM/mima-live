<script setup lang="ts">
const theKitMenu = ref<HTMLDialogElement>();
onBeforeRouteUpdate(() => {
  theKitMenu.value?.close();
});
</script>

<template>
  <div class="flex h-dvh w-dvw font-mono">
    <div class="hidden min-w-56 flex-col overflow-y-auto bg-base-200 md:flex">
      <TheKitMenu />
    </div>
    <div class="flex h-dvh w-full flex-col overflow-y-scroll">
      <div id="notify" class="toast toast-center toast-top w-full max-w-xs md:toast-end" />
      <!-- Open the modal using ID.showModal() method -->
      <button class="btn btn-primary btn-lg m-8 md:hidden" onclick="theKitMenu.showModal()">
        Menu
      </button>
      <dialog id="theKitMenu" ref="theKitMenu" class="modal">
        <div class="modal-box h-full">
          <form method="dialog" class="flex items-center">
            <button class="btn mx-auto">
              Close
            </button>
          </form>
          <TheKitMenu />
        </div>
      </dialog>
      <RouterView class="mx-auto flex w-full max-w-md flex-col p-4" />
    </div>
  </div>
</template>
