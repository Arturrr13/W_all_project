/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

interface ImportMetaEnv {
  readonly VUE_APP_CAPTCHA_KEY: string;
  readonly VUE_APP_LANG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
interface Window {
  readonly __REDIRECT_LINK?: string;
}
