<script setup lang="ts">
import type { Codec, secp256k1 } from 'mima-kit';
import { U8 } from 'mima-kit';

defineOptions({ name: 'KitFormCurveTable' });
defineProps<{
  curve: typeof secp256k1;
  codec: Codec;
}>();
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <!-- head -->
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>p</td>
          <td>{{ codec(U8.fromBI(curve.p)) }}</td>
        </tr>
        <tr>
          <td>n</td>
          <td>{{ codec(U8.fromBI(curve.n)) }}</td>
        </tr>
        <tr>
          <td>a</td>
          <td>{{ codec(U8.fromBI(curve.a)) }}</td>
        </tr>
        <tr>
          <td>b</td>
          <td>{{ codec(U8.fromBI(curve.b)) }}</td>
        </tr>
        <tr>
          <td>G.x</td>
          <td>{{ codec(U8.fromBI(curve.G.x)) }}</td>
        </tr>
        <tr>
          <td>G.y</td>
          <td>{{ codec(U8.fromBI(curve.G.y)) }}</td>
        </tr>
        <tr>
          <td>h</td>
          <td>{{ codec(U8.fromBI(curve.h)) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
