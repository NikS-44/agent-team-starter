/**
 * Node 22+ can attach an experimental `globalThis.localStorage` that warns when
 * `--localstorage-file` is set without a valid path. MSW reads `localStorage` at
 * import time (cookie store). Install a simple in-memory store before any MSW
 * module loads (see `setupFiles` order in `vite.config.ts`).
 */
function createInMemoryLocalStorage(): Storage {
  const store: Record<string, string> = Object.create(null) as Record<string, string>;
  return {
    get length() {
      return Object.keys(store).length;
    },
    clear() {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    key(index: number) {
      return Object.keys(store)[index] ?? null;
    },
    removeItem(key: string) {
      delete store[key];
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
  } as Storage;
}

const storage = createInMemoryLocalStorage();

Object.defineProperty(globalThis, "localStorage", {
  value: storage,
  configurable: true,
  enumerable: true,
  writable: true,
});
