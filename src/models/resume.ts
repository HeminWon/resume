export interface BasicsProfile {
  network: string;
  username: string;
  url: string;
}

export interface BasicsLocation {
  address?: string;
  postalCode?: number;
  city?: string;
  countryCode?: string;
  region?: string;
}

export interface ResumeBasics {
  name: string;
  label: string;
  email?: string;
  phone?: string;
  website?: string;
  summary?: string;
  location?: BasicsLocation;
  profiles?: BasicsProfile[];
}

export interface ResumeWorkItem {
  company: string;
  position: string;
  website?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface ResumeProjectItem {
  name: string;
  startDate: string;
  endDate?: string;
  description?: string;
  duties?: string[];
  highlights?: string[];
  url?: string;
}

export interface ResumeEducationItem {
  institution: string;
  area?: string;
  collage?: string;
  studyType?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface ResumeSkillItem {
  name: string;
  level?: string;
  keywords?: string[];
}

export interface ResumeAbout {
  me: string[];
}

export interface ResumeLanguageItem {
  language: string;
  fluency?: string;
}

export interface ResumeData {
  basics: ResumeBasics;
  work?: ResumeWorkItem[];
  projects?: ResumeProjectItem[];
  education?: ResumeEducationItem[];
  skills?: ResumeSkillItem[];
  about?: ResumeAbout;
  languages?: ResumeLanguageItem[];
}
