import { WixDataItem } from ".";
import { seedMiniGames, seedPlayerCards } from "@/lib/seed-data";

/**
 * Pagination options for querying collections
 */
export interface PaginationOptions {
  /** Number of items per page (default: 50, max: 1000) */
  limit?: number;
  /** Number of items to skip (for offset-based pagination) */
  skip?: number;
}

/**
 * Metadata for a multi-reference field (available on item._refMeta[fieldName])
 * Only populated by getById, not getAll
 */
export interface RefFieldMeta {
  /** Total count of referenced items */
  totalCount: number;
  /** Number of items returned */
  returnedCount: number;
  /** Whether there are more items beyond what was returned */
  hasMore: boolean;
}

/**
 * Paginated result with metadata for infinite scroll
 */
export interface PaginatedResult<T> {
  /** Array of items for current page */
  items: T[];
  /** Total number of items in the collection */
  totalCount: number;
  /** Whether there are more items after current page */
  hasNext: boolean;
  /** Current page number (0-indexed) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Offset to use for next page */
  nextSkip: number | null;
}

/**
 * Helper to get local stored collection items from localStorage if available
 */
function getLocalStoredItems(collectionId: string): WixDataItem[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(`cyber_collection_${collectionId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }
  return [];
}

/**
 * Local in-memory collections used when there is no Wix runtime.
 * Enables the site to run fully standalone (dev preview / static hosting)
 * while still reading from Wix Data when it is available.
 */
const LOCAL_COLLECTIONS: Record<string, WixDataItem[]> = {
  minigames: seedMiniGames as unknown as WixDataItem[],
  playercards: seedPlayerCards as unknown as WixDataItem[],
};

/**
 * Lazily loads the Wix Data SDK. Returns `null` when running standalone so
 * callers can fall back to the local collections above.
 */
async function getWixItems(): Promise<any | null> {
  try {
    const mod = await import("@wix/data");
    return mod.items;
  } catch {
    return null;
  }
}

/**
 * Generic CRUD Service class for Wix Data collections
 * Provides type-safe CRUD operations with error handling and guaranteed local fallback.
 */
export class BaseCrudService {
  /**
   * Populates multi-reference fields for a single item using queryReferenced()
   */
  private static async populateMultiRefs<T extends WixDataItem>(
    collectionId: string,
    item: T,
    multiRefs: string[]
  ): Promise<T> {
    if (multiRefs.length === 0) return item;

    const items = await getWixItems();
    if (!items) return item;

    const itemWithRefs = { ...item } as any;
    itemWithRefs._refMeta = {};

    for (const refField of multiRefs) {
      try {
        const result = await items.queryReferenced(collectionId, item._id, refField, {
          limit: 1000,
          returnTotalCount: true
        });

        itemWithRefs[refField] = result.items;
        itemWithRefs._refMeta[refField] = {
          totalCount: result.totalCount ?? result.items.length,
          returnedCount: result.items.length,
          hasMore: result.hasNext()
        };
      } catch {
        itemWithRefs[refField] = [];
        itemWithRefs._refMeta[refField] = { totalCount: 0, returnedCount: 0, hasMore: false };
      }
    }
    return itemWithRefs as T;
  }

  /**
   * Creates a new item in the collection with guaranteed local persistence
   */
  static async create<T extends WixDataItem>(
    collectionId: string,
    itemData: Partial<T> | Record<string, unknown>,
    multiReferences?: Record<string, any>
  ): Promise<T> {
    const generateId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'id_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    };

    const created = {
      ...(itemData as Record<string, unknown>),
      _id: (itemData as Record<string, unknown>)._id || generateId(),
      _createdDate: new Date(),
      _updatedDate: new Date(),
    } as T;

    // Always persist to local in-memory collection
    if (!LOCAL_COLLECTIONS[collectionId]) {
      LOCAL_COLLECTIONS[collectionId] = [];
    }
    LOCAL_COLLECTIONS[collectionId].unshift(created as WixDataItem);

    // Persist to browser localStorage for offline & reload durability
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `cyber_collection_${collectionId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift(created);
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 100)));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
    }

    // Attempt Wix insert if connected, but never fail if Wix throws
    try {
      const items = await getWixItems();
      if (items && typeof items.insert === 'function') {
        const result = (await items.insert(collectionId, itemData as Record<string, unknown>)) as T;
        if (result && result._id) {
          if (multiReferences && Object.keys(multiReferences).length > 0) {
            for (const [propertyName, refIds] of Object.entries(multiReferences)) {
              if (Array.isArray(refIds) && refIds.length > 0) {
                try {
                  await items.insertReference(collectionId, propertyName, result._id, refIds as string[]);
                } catch {
                  // ignore reference insert error
                }
              }
            }
          }
          return result;
        }
      }
    } catch (error) {
      console.info(`Wix remote save unavailable for ${collectionId}, using local storage storage.`);
    }

    return created;
  }

  /**
   * Retrieves items from the collection with guaranteed fallback to local seeds
   */
  static async getAll<T extends WixDataItem>(
    collectionId: string,
    includeRefs?: { singleRef?: string[]; multiRef?: string[] } | string[],
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    // Combine in-memory seeds + browser localStorage items
    const getLocalItems = (): T[] => {
      const stored = getLocalStoredItems(collectionId) as T[];
      const memory = (LOCAL_COLLECTIONS[collectionId] || []) as T[];
      // merge unique by _id
      const idMap = new Map<string, T>();
      for (const item of stored) {
        if (item && item._id) idMap.set(item._id, item);
      }
      for (const item of memory) {
        if (item && item._id && !idMap.has(item._id)) idMap.set(item._id, item);
      }
      return Array.from(idMap.values());
    };

    const localList = getLocalItems();

    try {
      const items = await getWixItems();
      if (!items) {
        return {
          items: localList,
          totalCount: localList.length,
          hasNext: false,
          currentPage: 0,
          pageSize: 50,
          nextSkip: null,
        };
      }

      const limit = Math.min(pagination?.limit ?? 50, 1000);
      const skip = pagination?.skip ?? 0;

      const allRefs = Array.isArray(includeRefs)
        ? includeRefs
        : [...(includeRefs?.singleRef || []), ...(includeRefs?.multiRef || [])];

      let query = items.query(collectionId);
      if (allRefs.length > 0) {
        query = query.include(...allRefs);
      }

      const result = await query.skip(skip).limit(limit).find({ returnTotalCount: true });
      if (result && Array.isArray(result.items) && result.items.length > 0) {
        const hasNext = typeof result.hasNext === 'function' ? result.hasNext() : false;
        return {
          items: result.items as T[],
          totalCount: result.totalCount ?? result.items.length,
          hasNext,
          currentPage: Math.floor(skip / limit),
          pageSize: limit,
          nextSkip: hasNext ? skip + limit : null,
        };
      }
    } catch (error) {
      console.info(`Wix fetch for ${collectionId} unavailable, using local arena data.`);
    }

    // Default fallback to local seeds
    return {
      items: localList,
      totalCount: localList.length,
      hasNext: false,
      currentPage: 0,
      pageSize: 50,
      nextSkip: null,
    };
  }

  /**
   * Retrieves a single item by ID with guaranteed local fallback
   */
  static async getById<T extends WixDataItem>(
    collectionId: string,
    itemId: string,
    includeRefs?: { singleRef?: string[]; multiRef?: string[] } | string[]
  ): Promise<T | null> {
    const findLocal = (): T | null => {
      const stored = getLocalStoredItems(collectionId) as T[];
      const foundStored = stored.find((item) => item._id === itemId);
      if (foundStored) return foundStored;

      const local = (LOCAL_COLLECTIONS[collectionId] || []) as T[];
      return local.find((item) => item._id === itemId) ?? null;
    };

    try {
      const items = await getWixItems();
      if (!items) return findLocal();

      const isLegacyFormat = Array.isArray(includeRefs);
      const singleRefs = isLegacyFormat ? includeRefs : (includeRefs?.singleRef || []);
      const multiRefs = isLegacyFormat ? [] : (includeRefs?.multiRef || []);

      let query = items.query(collectionId).eq("_id", itemId);
      if (singleRefs.length > 0) {
        query = query.include(...singleRefs);
      }

      const result = await query.find();
      if (result && Array.isArray(result.items) && result.items.length > 0) {
        return this.populateMultiRefs<T>(collectionId, result.items[0] as T, multiRefs);
      }
    } catch (error) {
      console.info(`Wix query for ${collectionId} item ${itemId} unavailable, using local fallback.`);
    }

    return findLocal();
  }

  /**
   * Updates an existing item
   */
  static async update<T extends WixDataItem>(collectionId: string, itemData: T): Promise<T> {
    if (!itemData._id) {
      throw new Error(`${collectionId} ID is required for update`);
    }

    const local = (LOCAL_COLLECTIONS[collectionId] || []) as T[];
    const index = local.findIndex((item) => item._id === itemData._id);
    if (index >= 0) {
      local[index] = { ...local[index], ...itemData, _updatedDate: new Date() };
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `cyber_collection_${collectionId}`;
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        const sIndex = stored.findIndex((s: any) => s._id === itemData._id);
        if (sIndex >= 0) {
          stored[sIndex] = { ...stored[sIndex], ...itemData };
          localStorage.setItem(key, JSON.stringify(stored));
        }
      } catch {}
    }

    try {
      const items = await getWixItems();
      if (items && typeof items.update === 'function') {
        const currentItem = await this.getById<T>(collectionId, itemData._id);
        const mergedData = { ...currentItem, ...itemData };
        const result = await items.update(collectionId, mergedData);
        return result as T;
      }
    } catch (error) {
      console.info(`Wix update for ${collectionId} unavailable, updated locally.`);
    }

    return itemData;
  }

  /**
   * Deletes an item by ID
   */
  static async delete<T extends WixDataItem>(collectionId: string, itemId: string): Promise<T> {
    const local = (LOCAL_COLLECTIONS[collectionId] || []) as T[];
    const index = local.findIndex((item) => item._id === itemId);
    let removed = { _id: itemId } as T;
    if (index >= 0) {
      [removed] = local.splice(index, 1);
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = `cyber_collection_${collectionId}`;
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = stored.filter((s: any) => s._id !== itemId);
        localStorage.setItem(key, JSON.stringify(filtered));
      } catch {}
    }

    try {
      const items = await getWixItems();
      if (items && typeof items.remove === 'function') {
        const result = await items.remove(collectionId, itemId);
        return (result || removed) as T;
      }
    } catch (error) {
      console.info(`Wix delete for ${collectionId} unavailable, deleted locally.`);
    }

    return removed;
  }

  static async addReferences(): Promise<void> {}
  static async removeReferences(): Promise<void> {}
}
