import { useCallback, useEffect, useState } from 'react';
import { ResumeData } from '../models/resume';
import { ResumeLanguage, fetchResumeData } from '../data/resumeService';

export type ResumeLoadState = {
  data: ResumeData | null;
  error: string | null;
  loading: boolean;
};

export const useResumeData = (lang: ResumeLanguage): [ResumeLoadState, () => void] => {
  const [state, setState] = useState<ResumeLoadState>({
    data: null,
    error: null,
    loading: true,
  });

  const load = useCallback(
    async (options?: { forceRefresh?: boolean }) => {
      setState((prev) => ({
        data: prev.data,
        error: null,
        loading: true,
      }));
      try {
        const data = await fetchResumeData(lang, options);
        setState({ data, error: null, loading: false });
      } catch (error) {
        setState({ data: null, error: (error as Error).message, loading: false });
      }
    },
    [lang]
  );

  useEffect(() => {
    load();
  }, [load]);

  const retry = useCallback(() => load({ forceRefresh: true }), [load]);

  return [state, retry];
};
