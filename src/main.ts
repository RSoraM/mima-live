import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './style.css';

const routes = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/' },
  {
    path: '/',
    component: () => import('./pages/index.vue'),
  },
  {
    path: '/tools',
    component: () => import('./pages/tools/index.vue'),
    children: [
      {
        name: 'TextCodec',
        path: 'TextCodec',
        component: () => import('./pages/tools/TextCodec.vue'),
      },
      {
        name: 'RSA',
        path: 'RSA',
        component: () => import('./pages/tools/RSA.vue'),
      },
      {
        path: 'ECC',
        children: [
          { name: 'Key', path: 'Key', component: () => import('./pages/tools/ECC/KeyGen.vue') },
          { name: 'ECDH', path: 'ECDH', component: () => import('./pages/tools/ECC/ECDH.vue') },
          { name: 'ECMQV', path: 'ECMQV', component: () => import('./pages/tools/ECC/ECMQV.vue') },
          { name: 'ECDSA', path: 'ECDSA', component: () => import('./pages/tools/ECC/ECDSA.vue') },
          { name: 'ECIES', path: 'ECIES', component: () => import('./pages/tools/ECC/ECIES.vue') },
        ],
      },
      {
        path: 'SM2',
        children: [
          { name: 'SM2DH', path: 'SM2DH', component: () => import('./pages/tools/SM2/SM2DH.vue') },
          { name: 'SM2DSA', path: 'SM2DSA', component: () => import('./pages/tools/SM2/SM2DSA.vue') },
          { name: 'SM2ES', path: 'SM2ES', component: () => import('./pages/tools/SM2/SM2ES.vue') },
        ],
      },
      {
        path: 'X25519',
        component: () => import('./pages/tools/X25519.vue'),
      },
      {
        path: 'Hash',
        children: [
          { name: 'SM3', path: 'SM3', component: () => import('./pages/tools/Hash/SM3.vue') },
          { name: 'MD5', path: 'MD5', component: () => import('./pages/tools/Hash/MD5.vue') },
          { name: 'SHA-1', path: 'SHA-1', component: () => import('./pages/tools/Hash/SHA-1.vue') },
          { name: 'SHA-2', path: 'SHA-2', component: () => import('./pages/tools/Hash/SHA-2.vue') },
          { name: 'SHA-3', path: 'SHA-3', component: () => import('./pages/tools/Hash/SHA-3.vue') },
          { name: 'SHAKE', path: 'SHAKE', component: () => import('./pages/tools/Hash/SHAKE.vue') },
          { name: 'cSHAKE', path: 'cSHAKE', component: () => import('./pages/tools/Hash/cSHAKE.vue') },
          { name: 'TupleHash', path: 'TupleHash', component: () => import('./pages/tools/Hash/TupleHash.vue') },
          { name: 'ParallelHash', path: 'ParallelHash', component: () => import('./pages/tools/Hash/ParallelHash.vue') },
          { name: 'TurboSHAKE', path: 'TurboSHAKE', component: () => import('./pages/tools/Hash/TurboSHAKE.vue') },
          { name: 'KangarooTwelve', path: 'KangarooTwelve', component: () => import('./pages/tools/Hash/K12.vue') },
          { name: 'KMAC', path: 'KMAC', component: () => import('./pages/tools/Hash/KMAC.vue') },
          { name: 'HMAC', path: 'HMAC', component: () => import('./pages/tools/Hash/HMAC.vue') },
          { name: 'TOTP', path: 'TOTP', component: () => import('./pages/tools/Hash/TOTP.vue') },
        ],
      },
      {
        path: 'BlockCipher',
        children: [
          { name: 'SM4', path: 'SM4', component: () => import('./pages/tools/BlockCipher/SM4.vue') },
          { name: 'AES', path: 'AES', component: () => import('./pages/tools/BlockCipher/AES.vue') },
          { name: 'ARIA', path: 'ARIA', component: () => import('./pages/tools/BlockCipher/ARIA.vue') },
          { name: 'Camellia', path: 'Camellia', component: () => import('./pages/tools/BlockCipher/Camellia.vue') },
          { name: 'DES', path: 'DES', component: () => import('./pages/tools/BlockCipher/DES.vue') },
          { name: '3DES', path: '3DES', component: () => import('./pages/tools/BlockCipher/3DES.vue') },
          { name: 'ARC5', path: 'ARC5', component: () => import('./pages/tools/BlockCipher/ARC5.vue') },
          { name: 'Blowfish', path: 'Blowfish', component: () => import('./pages/tools/BlockCipher/Blowfish.vue') },
          { name: 'Twofish', path: 'Twofish', component: () => import('./pages/tools/BlockCipher/Twofish.vue') },
          { name: 'TEA', path: 'TEA', component: () => import('./pages/tools/BlockCipher/TEA.vue') },
          { name: 'XTEA', path: 'XTEA', component: () => import('./pages/tools/BlockCipher/XTEA.vue') },
          { name: 'XXTEA', path: 'XXTEA', component: () => import('./pages/tools/BlockCipher/XXTEA.vue') },
        ],
      },
      {
        path: 'StreamCipher',
        children: [
          { name: 'ZUC', path: 'ZUC', component: () => import('./pages/tools/StreamCipher/ZUC.vue') },
          { name: 'ARC4', path: 'ARC4', component: () => import('./pages/tools/StreamCipher/ARC4.vue') },
          { name: 'Rabbit', path: 'Rabbit', component: () => import('./pages/tools/StreamCipher/Rabbit.vue') },
          { name: 'Salsa20', path: 'Salsa20', component: () => import('./pages/tools/StreamCipher/Salsa20.vue') },
        ],
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory('/mima-live'),
  routes,
});

const pinia = createPinia();
createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app');
