<template>
  <KitMenu>
    <KitMenuItem>
      <RouterLink to="/">Home</RouterLink>
    </KitMenuItem>
    <!-- Hash -->
    <KitMenuGroup title="Hash" :is-open="isHashGroupOpen">
      <KitMenuItem v-for="h in Hash" :key="h.name">
        <RouterLink :to="h.path">
          {{ h.name }}
        </RouterLink>
      </KitMenuItem>
    </KitMenuGroup>
    <!-- Block Cipher -->
    <KitMenuGroup title="Block Cipher" :is-open="isBlockCipherGroupOpen">
      <KitMenuItem v-for="h in BlockCipher" :key="h.name">
        <RouterLink :to="h.path">
          {{ h.name }}
        </RouterLink>
      </KitMenuItem>
    </KitMenuGroup>
    <!-- Stream Cipher -->
    <KitMenuGroup title="Stream Cipher" :is-open="isStreamCipherGroupOpen">
      <KitMenuItem v-for="h in StreamCipher" :key="h.name">
        <RouterLink :to="h.path">
          {{ h.name }}
        </RouterLink>
      </KitMenuItem>
    </KitMenuGroup>
  </KitMenu>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

interface MenuLink {
  name: string
  path: string
}
const Hash: MenuLink[] = []
const BlockCipher: MenuLink[] = []
const StreamCipher: MenuLink[] = []
router.getRoutes().forEach((route) => {
  if (route.path.startsWith('/tools/Hash')) {
    Hash.push({ name: route.path.split('/').pop() || '', path: route.path })
  }
  if (route.path.startsWith('/tools/BlockCipher')) {
    BlockCipher.push({ name: route.path.split('/').pop() || '', path: route.path })
  }
  if (route.path.startsWith('/tools/StreamCipher')) {
    StreamCipher.push({ name: route.path.split('/').pop() || '', path: route.path })
  }
})

const isHashGroupOpen = computed(() => route.path.startsWith('/tools/Hash'))
const isBlockCipherGroupOpen = computed(() => route.path.startsWith('/tools/BlockCipher'))
const isStreamCipherGroupOpen = computed(() => route.path.startsWith('/tools/StreamCipher'))
</script>
