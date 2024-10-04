import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { createWebHistory, createRouter, } from 'vue-router'

const Hash = [
  { name: 'SM3', path: './pages/tools/Hash/SM3.vue' },
  { name: 'MD5', path: './pages/tools/Hash/MD5.vue' },
  { name: 'SHA-1', path: './pages/tools/Hash/SHA-1.vue' },
  { name: 'SHA-2', path: './pages/tools/Hash/SHA-2.vue' },
  { name: 'SHA-3', path: './pages/tools/Hash/SHA-3.vue' },
  { name: 'SHAKE', path: './pages/tools/Hash/SHAKE.vue' },
  { name: 'cSHAKE', path: './pages/tools/Hash/cSHAKE.vue' },
  { name: 'TupleHash', path: './pages/tools/Hash/TupleHash.vue' },
  { name: 'ParallelHash', path: './pages/tools/Hash/ParallelHash.vue' },
  { name: 'KMAC', path: './pages/tools/Hash/KMAC.vue' },
  { name: 'HMAC', path: './pages/tools/Hash/HMAC.vue' },
]
const BlockCipher = [
  { name: 'SM4', path: './pages/tools/BlockCipher/SM4.vue' },
  { name: 'AES', path: './pages/tools/BlockCipher/AES.vue' },
  { name: 'ARIA', path: './pages/tools/BlockCipher/ARIA.vue' },
  { name: 'Camellia', path: './pages/tools/BlockCipher/Camellia.vue' },
  { name: 'DES', path: './pages/tools/BlockCipher/DES.vue' },
  { name: '3DES', path: './pages/tools/BlockCipher/3DES.vue' },
  { name: 'ARC5', path: './pages/tools/BlockCipher/ARC5.vue' },
  { name: 'Blowfish', path: './pages/tools/BlockCipher/Blowfish.vue' },
  { name: 'Twofish', path: './pages/tools/BlockCipher/Twofish.vue' },
  { name: 'TEA', path: './pages/tools/BlockCipher/TEA.vue' },
  { name: 'XTEA', path: './pages/tools/BlockCipher/XTEA.vue' },
]
const StreamCipher = [
  { name: 'ZUC', path: './pages/tools/StreamCipher/ZUC.vue' },
  { name: 'ARC4', path: './pages/tools/StreamCipher/ARC4.vue' },
  { name: 'Salsa20', path: './pages/tools/StreamCipher/Salsa20.vue' },
  { name: 'Rabbit', path: './pages/tools/StreamCipher/Rabbit.vue' },
]

const routes = [
  {
    path: '/',
    component: () => import('./pages/index.vue')
  },
  {
    path: '/tools',
    component: () => import('./pages/tools/index.vue'),
    children: [
      {
        path: 'Hash',
        children: Hash.map(({ name, path }) => ({ path: name, component: () => import(path) })),
      },
      {
        path: 'BlockCipher',
        children: BlockCipher.map(({ name, path }) => ({ path: name, component: () => import(path) })),
      },
      {
        path: 'StreamCipher',
        children: StreamCipher.map(({ name, path }) => ({ path: name, component: () => import(path) })),
      },
    ]
  },
]
const router = createRouter({
  history: createWebHistory('/mima-live'),
  routes,
})

createApp(App)
  .use(router)
  .mount('#app')
