const getPublicUrl = (): string => {
  const raw = process.env.PUBLIC_URL;
  if (!raw) {
    return '';
  }
  if (raw === '.') {
    return '.';
  }
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
};

export const withPublicUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = getPublicUrl();
  if (!base) {
    return normalizedPath;
  }
  if (base === '.') {
    return `.${normalizedPath}`;
  }
  return `${base}${normalizedPath}`;
};
