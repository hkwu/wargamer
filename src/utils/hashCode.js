/**
 * JavaScript version of Java's String.hashCode() method.
 * @param {string} string - The string to hash.
 * @return {string} The hashed string.
 * @private
 */
export default function hashCode(string) {
  let hash = 0;

  if (!string.length) {
    return hash.toString();
  }

  for (let i = 0; i < string.length; ++i) {
    const char = string.charAt(i);

    hash = ((hash << 5) - hash) + char;
    hash &= hash;
  }

  return hash.toString();
}
