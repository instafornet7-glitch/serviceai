const PREFIX = "serviceai:";
export const LOCAL_DB_EVENT = "serviceai-localdb-updated";
const ARTICLE_STORAGE_KEYS = ["articles", "blogPosts", "serviceai_articles"] as const;

export const LOCAL_DB_KEYS = {
  articles: "articles",
  categories: "categories",
  preferences: "preferences",
  services: "services",
  requests: "requests",
  clients: "clients",
  orders: "orders",
} as const;

const initialCategories = [
  { id: "local-category-cv", name: "السيرة الذاتية", slug: "cv" },
  { id: "local-category-interviews", name: "مقابلات العمل", slug: "interviews" },
  { id: "local-category-job-search", name: "البحث عن وظيفة", slug: "job-search" },
  { id: "local-category-cover-letters", name: "رسائل التقديم", slug: "cover-letters" },
  { id: "local-category-ats", name: "نظام ATS", slug: "ats" },
  { id: "local-category-career", name: "تطوير المسار المهني", slug: "career-development" },
];

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function keyFor(key: string): string {
  return `${PREFIX}${key}`;
}

function announce(key: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(LOCAL_DB_EVENT, { detail: key }));
  }
}

export function get<T>(key: string, fallback: T): T {
  const store = storage();
  if (!store) return fallback;
  const storageKeys = key === LOCAL_DB_KEYS.articles
    ? [...ARTICLE_STORAGE_KEYS, keyFor(key)]
    : [keyFor(key)];
  let emptyValue: T | undefined;
  for (const storageKey of storageKeys) {
    const value = store.getItem(storageKey);
    if (value === null) continue;
    try {
      const parsed = JSON.parse(value) as T;
      if (key !== LOCAL_DB_KEYS.articles || !Array.isArray(parsed) || parsed.length > 0) return parsed;
      emptyValue = parsed;
    } catch (error) {
      console.error(`Local database entry "${storageKey}" contains invalid JSON.`, error);
    }
  }
  if (emptyValue !== undefined) return emptyValue;
  if (key === LOCAL_DB_KEYS.categories) {
    set(key, initialCategories);
    return initialCategories as T;
  }
  return fallback;
}

export function set<T>(key: string, value: T): void {
  const store = storage();
  if (!store) throw new Error("Local storage is available only in the browser.");
  const serialized = JSON.stringify(value);
  const storageKeys = key === LOCAL_DB_KEYS.articles
    ? [...ARTICLE_STORAGE_KEYS]
    : [keyFor(key)];
  try {
    if (key === LOCAL_DB_KEYS.articles) store.removeItem(keyFor(key));
    for (const storageKey of storageKeys) store.setItem(storageKey, serialized);
  } catch (error) {
    if (error instanceof DOMException && (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")) {
      throw new Error("مساحة التخزين المحلية ممتلئة. احذف صورًا أو مقالات قديمة ثم حاول مجددًا.");
    }
    throw error;
  }
  announce(key);
}

export function add<T extends { id: string }>(key: string, value: T): T {
  const values = get<T[]>(key, []);
  const index = values.findIndex((item) => item.id === value.id);
  if (index === -1) values.push(value);
  else values[index] = value;
  set(key, values);
  return value;
}

export function remove<T extends { id: string }>(key: string, id: string): boolean {
  const values = get<T[]>(key, []);
  const filtered = values.filter((item) => item.id !== id);
  if (filtered.length === values.length) return false;
  set(key, filtered);
  return true;
}

export { remove as delete };

export function subscribe(listener: (key: string) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onLocal = (event: Event) => {
    listener((event as CustomEvent<string>).detail);
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key?.startsWith(PREFIX)) {
      listener(event.key.slice(PREFIX.length));
    } else if (ARTICLE_STORAGE_KEYS.includes(event.key as (typeof ARTICLE_STORAGE_KEYS)[number])) {
      listener(LOCAL_DB_KEYS.articles);
    }
  };
  window.addEventListener(LOCAL_DB_EVENT, onLocal);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(LOCAL_DB_EVENT, onLocal);
    window.removeEventListener("storage", onStorage);
  };
}

export function makeId(): string {
  return crypto.randomUUID();
}
