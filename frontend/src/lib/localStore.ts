const STORAGE_PREFIX = "erp-vista";

function storageKey(collection: string) {
  return `${STORAGE_PREFIX}:${collection}`;
}

function seqKey(collection: string) {
  return `${STORAGE_PREFIX}:${collection}:seq`;
}

export function createLocalStore<T extends Record<string, unknown>>(
  collection: string,
  idField: keyof T & string,
  seedData: T[] = []
) {
  const initSeq = () => {
    const maxId = seedData.reduce(
      (max, item) => Math.max(max, Number(item[idField]) || 0),
      0
    );
    localStorage.setItem(seqKey(collection), String(maxId));
  };

  const readAll = (): T[] => {
    try {
      const raw = localStorage.getItem(storageKey(collection));
      if (!raw) {
        localStorage.setItem(storageKey(collection), JSON.stringify(seedData));
        initSeq();
        return [...seedData];
      }
      return JSON.parse(raw) as T[];
    } catch {
      return [...seedData];
    }
  };

  const writeAll = (items: T[]) => {
    localStorage.setItem(storageKey(collection), JSON.stringify(items));
  };

  const nextId = (items: T[]): number => {
    const storedSeq = localStorage.getItem(seqKey(collection));
    const maxExisting = items.reduce(
      (max, item) => Math.max(max, Number(item[idField]) || 0),
      0
    );
    const current = storedSeq
      ? parseInt(storedSeq, 10)
      : maxExisting;
    const synced = Math.max(current, maxExisting);
    const next = synced + 1;
    localStorage.setItem(seqKey(collection), String(next));
    return next;
  };

  return {
    getAll: readAll,

    getById: (id: number): T | undefined =>
      readAll().find((item) => Number(item[idField]) === id),

    create: (payload: Omit<T, typeof idField>): T => {
      const items = readAll();
      const record = { ...payload, [idField]: nextId(items) } as T;
      items.push(record);
      writeAll(items);
      return record;
    },

    update: (id: number, payload: Partial<T>): T | null => {
      const items = readAll();
      const index = items.findIndex((item) => Number(item[idField]) === id);
      if (index === -1) return null;

      const updated = { ...items[index], ...payload, [idField]: id } as T;
      items[index] = updated;
      writeAll(items);
      return updated;
    },

    remove: (id: number): boolean => {
      const items = readAll();
      const filtered = items.filter((item) => Number(item[idField]) !== id);
      if (filtered.length === items.length) return false;
      writeAll(filtered);
      return true;
    },
  };
}
