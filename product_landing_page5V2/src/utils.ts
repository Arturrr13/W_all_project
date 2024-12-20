export const getLanguagePartFromCode = (code: string) => {
  if (!code || code.indexOf('-') < 0) return code;

  const p = code.split('-');
  return p[0].toLowerCase();
};

export const getCountryCodeFromLanguage = (lang: string) => {
  const lngCode = getLanguagePartFromCode(lang);
  switch (lngCode) {
    case 'en':
      return 'GB';
    case 'cs':
      return 'CZ';
    default:
      return lngCode.toUpperCase();
  }
};
