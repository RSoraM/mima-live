<script setup lang="ts">
defineOptions({ name: 'TheKitMenu' });

const route = useRoute();
const router = useRouter();

interface MenuLink {
  name: string;
  path: string;
}
const SM2: MenuLink[] = [];
const ECC: MenuLink[] = [];
const Hash: MenuLink[] = [];
const BlockCipher: MenuLink[] = [];
const StreamCipher: MenuLink[] = [];
router.getRoutes().forEach((route) => {
  if (route.path.startsWith('/tools/SM2')) {
    SM2.push({ name: route.name?.toString() || route.path.split('/').pop() || '', path: route.path });
  }
  if (route.path.startsWith('/tools/ECC')) {
    ECC.push({ name: route.name?.toString() || route.path.split('/').pop() || '', path: route.path });
  }
  if (route.path.startsWith('/tools/Hash')) {
    Hash.push({ name: route.path.split('/').pop() || '', path: route.path });
  }
  if (route.path.startsWith('/tools/BlockCipher')) {
    BlockCipher.push({ name: route.path.split('/').pop() || '', path: route.path });
  }
  if (route.path.startsWith('/tools/StreamCipher')) {
    StreamCipher.push({ name: route.path.split('/').pop() || '', path: route.path });
  }
});

const isSM2GroupOpen = computed(() => route.path.startsWith('/tools/SM2'));
const isECCGroupOpen = computed(() => route.path.startsWith('/tools/ECC'));
const isHashGroupOpen = computed(() => route.path.startsWith('/tools/Hash'));
const isBlockCipherGroupOpen = computed(() => route.path.startsWith('/tools/BlockCipher'));
const isStreamCipherGroupOpen = computed(() => route.path.startsWith('/tools/StreamCipher'));

const routeName = computed(() => route.path.split('/').pop());
const currentTheme = useLocalStorage('theme', 'dark');
</script>

<template>
  <KitMenu>
    <KitMenuItem>
      <RouterLink to="/">
        Home
      </RouterLink>
    </KitMenuItem>
    <KitMenuGroup title="Theme">
      <template #title>
        <div class="flex items-center justify-center gap-2">
          Theme
          <span class="icon-[carbon--color-palette] size-4" />
        </div>
      </template>
      <KitMenuItem v-for="t in themes" :key="t">
        <label>
          {{ t.toUpperCase() }}
          <input
            v-model="currentTheme"
            type="radio"
            name="theme-option"
            class="theme-controller hidden"
            :value="t"
          >
        </label>
      </KitMenuItem>
    </KitMenuGroup>
    <!-- Hash -->
    <KitMenuGroup title="Hash" :is-open="isHashGroupOpen">
      <KitMenuItem v-for="h in Hash" :key="h.name">
        <RouterLink
          :to="h.path"
          :class="routeName === h.name ? 'active' : ''"
        >
          {{ h.name }}
        </RouterLink>
      </KitMenuItem>
    </KitMenuGroup>
    <!-- Block Cipher -->
    <KitMenuGroup title="Block Cipher" :is-open="isBlockCipherGroupOpen">
      <KitMenuItem v-for="h in BlockCipher" :key="h.name">
        <RouterLink
          :to="h.path"
          :class="routeName === h.name ? 'active' : ''"
        >
          {{ h.name }}
        </RouterLink>
      </KitMenuItem>
    </KitMenuGroup>
    <!-- Stream Cipher -->
    <KitMenuGroup title="Stream Cipher" :is-open="isStreamCipherGroupOpen">
      <KitMenuItem v-for="h in StreamCipher" :key="h.name">
        <RouterLink
          :to="h.path"
          :class="routeName === h.name ? 'active' : ''"
        >
          {{ h.name }}
        </RouterLink>
      </KitMenuItem>
    </KitMenuGroup>
    <!-- RSA -->
    <KitMenuItem>
      <RouterLink
        to="/tools/RSA"
        :class="routeName === 'RSA' ? 'active' : ''"
      >
        RSA
      </RouterLink>
    </KitMenuItem>
    <!-- ECC -->
    <KitMenuGroup title="ECC" :is-open="isECCGroupOpen">
      <KitMenuItem v-for="h in ECC" :key="h.name">
        <RouterLink
          :to="h.path"
          :class="routeName === h.name ? 'active' : ''"
        >
          {{ h.name }}
        </RouterLink>
      </KitMenuItem>
    </KitMenuGroup>
    <!-- SM2 -->
    <KitMenuGroup title="SM2" :is-open="isSM2GroupOpen">
      <KitMenuItem v-for="h in SM2" :key="h.name">
        <RouterLink
          :to="h.path"
          :class="routeName === h.name ? 'active' : ''"
        >
          {{ h.name }}
        </RouterLink>
      </KitMenuItem>
    </KitMenuGroup>
    <!-- X25519 -->
    <KitMenuItem>
      <RouterLink
        to="/tools/X25519"
        :class="routeName === 'X25519' ? 'active' : ''"
      >
        X25519
      </RouterLink>
    </KitMenuItem>
    <!-- Text Codec -->
    <KitMenuItem>
      <RouterLink
        to="/tools/TextCodec"
        :class="routeName === 'TextCodec' ? 'active' : ''"
      >
        TextCodec
      </RouterLink>
    </KitMenuItem>
  </KitMenu>
</template>
