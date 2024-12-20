import { useTranslation } from '@/composition/useTranslation';
import { onMounted } from 'vue';
import { getLocaleJsonCodeList } from '@/locales-loader';

export const useLangDebug = () => {
  const { i18next } = useTranslation();
  onMounted(() => {
    // @ts-ignore
    window.__LOCALE = {
      i18next,
      languages: getLocaleJsonCodeList(),
    };
  });
};
