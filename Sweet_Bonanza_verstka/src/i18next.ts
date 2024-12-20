import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getLocaleJsonCodeList, getLocaleJsonLoader } from '@/locales-loader';
import resourcesToBackend from 'i18next-resources-to-backend';

i18n.use(LanguageDetector);
i18n.use(
  resourcesToBackend((lng: string, ns: string) => {
    const loader = getLocaleJsonLoader(lng, `${ns}.json`, {
      fallback: null,
    });
    return loader().then((json) => JSON.parse(json));
  })
);
const initPromise = i18n.init({
  lng: import.meta.env.VUE_APP_LANG || undefined,
  fallbackLng: 'en',
  supportedLngs: getLocaleJsonCodeList(),
  defaultNS: 'common',
  load: 'languageOnly',
  ns: ['common'],
  returnEmptyString: false,

  detection: {
    order: ['navigator', 'htmlTag'],
  },
});

export { i18n, initPromise };
