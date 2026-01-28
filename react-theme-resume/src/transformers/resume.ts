import { ResumeData } from '../models/resume';

const isoDateRegex = /^\d{4}-\d{2}(-\d{2})?$/;

export const isIsoDateString = (value?: string): boolean => {
  if (!value) {
    return false;
  }
  if (!isoDateRegex.test(value)) {
    return false;
  }
  const parsed = Date.parse(value);
  return !Number.isNaN(parsed);
};

export const formatMonthYear = (value?: string): string => {
  if (!value) {
    return '';
  }
  if (!isIsoDateString(value)) {
    return value;
  }
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}.${month}`;
};

export const formatPeriod = (
  startDate: string,
  endDate: string | undefined,
  ongoingLabel: string
): string => {
  const startText = formatMonthYear(startDate);
  if (!endDate || !isIsoDateString(endDate)) {
    return `${startText} - ${ongoingLabel}`;
  }
  const endText = formatMonthYear(endDate);
  return `${startText} - ${endText}`;
};

export const normalizeResumeData = (data: ResumeData): ResumeData => ({
  basics: {
    ...data.basics,
    profiles: data.basics.profiles ?? [],
  },
  work: data.work ?? [],
  projects: data.projects ?? [],
  education: data.education ?? [],
  skills: data.skills ?? [],
  about: data.about ?? { me: [] },
  languages: data.languages ?? [],
});
