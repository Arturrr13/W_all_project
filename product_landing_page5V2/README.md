# skeleton

This template should help you get started developing landing pages with a registration form.

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```

## How use localization?

* The localization files are in `public/locales`
* To specify the language in dev mode, create a file `.env.development.local` and write to it `VUE_APP_LANG=`
* For localization, use the hook `useTranslation`

## How get api configuration?

Use function

```ts
import {getApiConfiguration} from '@/lib';
```

using it for getting captcha key

```ts
{
  captchaSiteKey: string;
}
```

Example:

```vue

<script setup lang="ts">
  import {onMounted, ref} from 'vue';
  import {getApiConfiguration, redirectToTDS} from '@/lib';

  const apiConfiguration = ref<{
    captchaSiteKey: string;
  } | null>(null);

  onMounted(async () => {
    try {
      apiConfiguration.value = await getApiConfiguration();
    } catch (reason) {
      redirectToTDS();
    }
  });
</script>
<template>
  <VueRecaptcha
      v-if="apiConfiguration"
      :sitekey="apiConfiguration.captchaSiteKey"
  />
</template>
```

## How to register?

Use function

```ts
import {registrationProcess} from '@/lib';
```

Function param

```ts
{
  email: string;
  password: string;
  phone: string;
  captcha: string;
}
;
```

Function exception

```ts
type Errors = string[]
```

## How get redirect link

Use function

```ts
import {getRedirectLink} from '@/lib';
```

Example:

```vue

<script setup lang="ts">
  import {getRedirectLink} from '@/lib';
</script>
<template>
  <a :href="getRedirectLink()">
    Go to product
  </a>
</template>
```

Use function

```ts
import {redirectToTDS} from '@/lib';
```

for instant redirection

## How to generate link based on global params

Use function

```ts
import {createDomainLinkSafe} from '@/lib';
```

Example:

```vue

<script setup lang="ts">
  import {createDomainLinkSafe} from '@/lib';

  const googleSignInLink = createDomainLinkSafe(
      '/api/oauth2/authorization/google'
  );
</script>
<template>
  <a :href="googleSignInLink">
    Register with google
  </a>
</template>
```