<script setup lang="ts">
defineOptions({ name: 'TheKitMenu' });

const route = useRoute();
const router = useRouter();

interface MenuLink {
  name: string;
  path: string;
}
const Hash: MenuLink[] = [];
const BlockCipher: MenuLink[] = [];
const StreamCipher: MenuLink[] = [];
router.getRoutes().forEach((route) => {
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

const isHashGroupOpen = computed(() => route.path.startsWith('/tools/Hash'));
const isBlockCipherGroupOpen = computed(() => route.path.startsWith('/tools/BlockCipher'));
const isStreamCipherGroupOpen = computed(() => route.path.startsWith('/tools/StreamCipher'));

const routeName = computed(() => route.path.split('/').pop());

const currentTheme = useLocalStorage('theme', 'dark');
const themes = [
  'light',
  'dark',
  'synthwave',
  'lofi',
  'dracula',
  'cmyk',
  'business',
  'acid',
];
</script>

<template>
  <KitMenu>
    <KitMenuItem>
      <RouterLink to="/">
        Home
      </RouterLink>
    </KitMenuItem>
    <KitMenuItem class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
        Theme
        <span class="icon-[carbon--color-palette] size-4" />
      </div>
      <ul tabindex="0" class="dropdown-content z-[99] w-52 rounded-box bg-base-300 p-2 shadow-2xl">
        <li v-for="t in themes" :key="t">
          <input
            v-model="currentTheme"
            type="radio"
            name="theme-dropdown"
            class="theme-controller btn btn-ghost btn-sm btn-block justify-start"
            :aria-label="t"
            :value="t"
          >
        </li>
      </ul>
    </KitMenuItem>
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
  </KitMenu>
</template>
