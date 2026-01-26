import { ResumeData } from '../models/resume';
import { normalizeResumeData } from '../transformers/resume';

export type ResumeLanguage = 'zh' | 'en';

type CachePayload = {
  version: number;
  data: ResumeData;
};

const CACHE_VERSION = 1;
const CACHE_KEY_PREFIX = 'resume_cache_v1_';
const memoryCache = new Map<ResumeLanguage, ResumeData>();

const getCacheKey = (lang: ResumeLanguage): string => `${CACHE_KEY_PREFIX}${lang}`;

const getSourcePath = (lang: ResumeLanguage): string => {
  if (lang === 'en') {
    return '/resume.en.json';
  }
  return '/resume.zh.json';
};

const readLocalCache = (lang: ResumeLanguage): ResumeData | null => {
  const key = getCacheKey(lang);
  const raw = localStorage.getItem(key);
  if (!raw) {
    return null;
  }
  try {
    const payload = JSON.parse(raw) as CachePayload;
    if (payload.version !== CACHE_VERSION) {
      return null;
    }
    return payload.data;
  } catch (error) {
    return null;
  }
};

const writeLocalCache = (lang: ResumeLanguage, data: ResumeData): void => {
  const key = getCacheKey(lang);
  const payload: CachePayload = {
    version: CACHE_VERSION,
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

export const fetchResumeData = async (
  lang: ResumeLanguage,
  options?: { forceRefresh?: boolean }
): Promise<ResumeData> => {
  if (!options?.forceRefresh) {
    const memoryHit = memoryCache.get(lang);
    if (memoryHit) {
      return memoryHit;
    }

    const localHit = readLocalCache(lang);
    if (localHit) {
      memoryCache.set(lang, localHit);
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
  memoryCache.set(lang, normalized);
  writeLocalCache(lang, normalized);
  return normalized;
};
