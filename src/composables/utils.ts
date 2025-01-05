export * from 'mima-kit';

/**
 * 获取大整数的比特长度
 *
 * Get the bit length of a BigInt
 */
export function getBIBits(n: bigint) {
  let bytes = 0;
  while (n > 0) {
    bytes++;
    n >>= 1n;
  }
  return bytes;
}

export function U8Point(point?: FpECPoint, byte?: number) {
  if (!point) {
    return { isInfinity: true, x: new U8(), y: new U8() };
  }
  const isInfinity = point.isInfinity;
  const x = typeof point.x === 'bigint'
    ? U8.fromBI(point.x, byte)
    : U8.from(point.x);
  const y = typeof point.y === 'bigint'
    ? U8.fromBI(point.y, byte)
    : U8.from(point.y);
  return { isInfinity, x, y };
}

export const themes = [
  'light',
  'dark',
  'synthwave',
  'lofi',
  'dracula',
  'cmyk',
  'business',
  'acid',
];
