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
