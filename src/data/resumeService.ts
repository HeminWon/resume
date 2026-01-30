import { ResumeData } from '../models/resume';
import { normalizeResumeData } from '../transformers/resume';
import { withPublicUrl } from '../utils/publicUrl';

export type ResumeLanguage = 'zh' | 'en';

type CachePayload = {
  schemaVersion: number;
  metaVersion?: string;
  data: ResumeData;
};

type ResumeMeta = {
  generatedAt: string;
  versions: Record<ResumeLanguage, string>;
  schemaVersion: number;
};

const CACHE_SCHEMA_VERSION = 1;
const CACHE_KEY_PREFIX = 'resume_cache_v1_';
const META_PATH = withPublicUrl('resume-meta.json');
const memoryCache = new Map<ResumeLanguage, { metaVersion?: string; data: ResumeData }>();
const META_TTL_MS = 5 * 60 * 1000;
let memoryMeta: ResumeMeta | null = null;
let memoryMetaFetchedAt = 0;

const getCacheKey = (lang: ResumeLanguage): string => `${CACHE_KEY_PREFIX}${lang}`;

const getSourcePath = (lang: ResumeLanguage): string => {
  if (lang === 'en') {
    return withPublicUrl('resume-en.json');
  }
  return withPublicUrl('resume-zh.json');
};

const readLocalCache = (lang: ResumeLanguage, metaVersion?: string): ResumeData | null => {
  const key = getCacheKey(lang);
  const raw = localStorage.getItem(key);
  if (!raw) {
    return null;
  }
  try {
    const payload = JSON.parse(raw) as CachePayload;
    if (payload.schemaVersion !== CACHE_SCHEMA_VERSION) {
      return null;
    }
    if (metaVersion && payload.metaVersion !== metaVersion) {
      return null;
    }
    return payload.data;
  } catch (error) {
    return null;
  }
};

const writeLocalCache = (lang: ResumeLanguage, data: ResumeData, metaVersion?: string): void => {
  const key = getCacheKey(lang);
  const payload: CachePayload = {
    schemaVersion: CACHE_SCHEMA_VERSION,
    metaVersion,
    data,
  };
  localStorage.setItem(key, JSON.stringify(payload));
};

export class ResumeFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResumeFetchError';
  }
}

const fetchResumeMeta = async (): Promise<ResumeMeta | null> => {
  const now = Date.now();
  if (memoryMeta && now - memoryMetaFetchedAt < META_TTL_MS) {
    return memoryMeta;
  }
  try {
    const response = await fetch(META_PATH, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    const json = (await response.json()) as ResumeMeta;
    if (!json?.versions || typeof json.schemaVersion !== 'number') {
      return null;
    }
    memoryMeta = json;
    memoryMetaFetchedAt = now;
    return json;
  } catch (error) {
    return memoryMeta;
  }
};

export const fetchResumeData = async (
  lang: ResumeLanguage,
  options?: { forceRefresh?: boolean }
): Promise<ResumeData> => {
  const meta = await fetchResumeMeta();
  const metaVersion = meta?.versions?.[lang];
  const schemaMatched = meta ? meta.schemaVersion === CACHE_SCHEMA_VERSION : true;

  if (!options?.forceRefresh) {
    const memoryHit = memoryCache.get(lang);
    if (memoryHit && schemaMatched && memoryHit.metaVersion === metaVersion) {
      return memoryHit.data;
    }

    const localHit = schemaMatched ? readLocalCache(lang, metaVersion) : null;
    if (localHit) {
      memoryCache.set(lang, { metaVersion, data: localHit });
      return localHit;
    }
  }

  const response = await fetch(getSourcePath(lang), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new ResumeFetchError(`Failed to load resume (${lang})`);
  }

  const json = (await response.json()) as ResumeData;
  const normalized = normalizeResumeData(json);
  memoryCache.set(lang, { metaVersion, data: normalized });
  if (schemaMatched) {
    writeLocalCache(lang, normalized, metaVersion);
  }
  return normalized;
};
