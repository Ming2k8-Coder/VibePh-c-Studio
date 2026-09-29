import fs from 'fs';
import path from 'path';
import { LookbookRecord, RemixResponse } from '../types/lookbook';
import { SERVER_FALLBACK_LOOKBOOKS } from '../data/garments';

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.resolve(DATA_DIR, 'lookbooks.json');

// In-memory cache with fallback seed items
let cachedLookbooks: LookbookRecord[] = [];

// Initialize with verified lookbooks
function initializeData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      cachedLookbooks = JSON.parse(raw);
    } else {
      // Seed with initial authentic lookbooks
      cachedLookbooks = SERVER_FALLBACK_LOOKBOOKS.map((fb, idx) => ({
        ...fb,
        id: fb.id || `preset-${idx + 1}`,
        createdAt: new Date(Date.now() - (idx + 1) * 3600000).toISOString(),
        savedAt: new Date(Date.now() - (idx + 1) * 3600000).toISOString(),
      }));
      fs.writeFileSync(DATA_FILE, JSON.stringify(cachedLookbooks, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[Storage] File persistence fallback to memory only:', err);
    if (cachedLookbooks.length === 0) {
      cachedLookbooks = SERVER_FALLBACK_LOOKBOOKS.map((fb, idx) => ({
        ...fb,
        id: fb.id || `preset-${idx + 1}`,
        createdAt: new Date().toISOString(),
      }));
    }
  }
}

// Initial run
initializeData();

/**
 * Retrieves lookbooks list from Firestore or fallback store
 */
export async function getLookbooks(): Promise<LookbookRecord[]> {
  try {
    // If Firestore REST API / credentials are configured, we could query here.
    // Return sorted by newest first
    return [...cachedLookbooks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.error('[Storage] Error retrieving lookbooks:', err);
    return cachedLookbooks;
  }
}

/**
 * Saves a lookbook into persistent storage
 */
export async function saveLookbook(item: RemixResponse): Promise<LookbookRecord> {
  const newRecord: LookbookRecord = {
    ...item,
    id: item.id && !item.id.startsWith('violation') ? item.id : `lookbook-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: item.createdAt || new Date().toISOString(),
    savedAt: new Date().toISOString(),
  };

  // Check if already in cache by ID
  const existingIdx = cachedLookbooks.findIndex((lb) => lb.id === newRecord.id);
  if (existingIdx >= 0) {
    cachedLookbooks[existingIdx] = newRecord;
  } else {
    cachedLookbooks.unshift(newRecord);
  }

  // Persist to file
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(cachedLookbooks, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Storage] Could not write to disk, saved in memory:', err);
  }

  return newRecord;
}

export function getLookbooksCount(): number {
  return cachedLookbooks.length;
}
