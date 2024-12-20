const jsonModules = import.meta.glob('./locales/*/*.json', {
  as: 'raw',
});
const imageModules = import.meta.glob('./locales/*/*.(png|jpg)', {
  as: 'url',
  eager: true,
});

type Languages = string;
type Options = {
  fallback?: string | null;
};

const getKey = (lang: Languages, file: string) => `./locales/${lang}/${file}`;

export const getLocaleJsonCodeList = () => {
  const lngSet = Object.keys(jsonModules).reduce((langSet, key) => {
    const reg = new RegExp('^\\.\\/locales\\/(.*?)\\/.*\\.json$', 'g');
    const match = reg.exec(key);
    if (match) {
      langSet.add(match[1]);
    }
    return langSet;
  }, new Set<string>());
  return Array.from(lngSet);
};
export const hasLocaleJson = (lang: Languages, file: string) =>
  getKey(lang, file) in jsonModules;
export const hasLocaleImage = (lang: Languages, file: string) =>
  getKey(lang, file) in imageModules;

const defOptions: Options = {
  fallback: 'en',
};
const createResourceExtractor =
  <S extends typeof jsonModules | typeof imageModules>(
    source: S,
    extensions: string[]
  ) =>
  (lang: Languages, file: string, options?: Options): S[keyof S] => {
    if (!extensions.some((ext) => file.endsWith(`.${ext}`))) {
      throw Error(`Attempted to load a file with the wrong extension: ${file}`);
    }
    const opt = Object.assign({}, defOptions, options) as Options;
    const key = getKey(lang, file);

    if (key in source) {
      return source[key as keyof S];
    }
    if (opt.fallback) {
      const keyFallback = getKey(opt.fallback, file);
      if (keyFallback in source) {
        return source[keyFallback as keyof S];
      }
    }
    throw Error(`Attempting to load an unassigned localization file: ${key}`);
  };

export const getLocaleJsonLoader = createResourceExtractor(jsonModules, [
  'json',
]);

export const getLocaleImageUrl = createResourceExtractor(imageModules, [
  'png',
  'jpg',
]);
