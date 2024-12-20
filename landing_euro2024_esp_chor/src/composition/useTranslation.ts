import type { KeyPrefix, Namespace, TFunction, TypeOptions } from 'i18next';
import { useTranslation as useI18N } from 'i18next-vue';
import { computed, readonly, type Ref, unref, watch } from 'vue';

type DefaultNamespace = TypeOptions['defaultNS'];

export interface UseTranslationOptions<TKPrefix = undefined> {
  keyPrefix?: TKPrefix;
  nsMode?: 'fallback' | 'default';
}
export function useTranslation<
  N extends Namespace = DefaultNamespace,
  TKPrefix extends KeyPrefix<N> = undefined
>(ns?: N | Ref<N>, options: UseTranslationOptions<TKPrefix> = {}) {
  const { i18next: i18n } = useI18N();

  const reactiveOptions = readonly(options);

  const namespaces = computed(() => {
    const _ns = unref(ns) || i18n.options?.defaultNS;
    return (
      typeof _ns === 'string' ? [_ns] : _ns || ['translation']
    ) as string[];
  });

  const ready = computed(() => {
    return (
      i18n.isInitialized &&
      namespaces.value.every((n) => i18n.hasLoadedNamespace(n))
    );
  });

  const tFunc = computed(() =>
    i18n.getFixedT(
      null,
      reactiveOptions.nsMode === 'fallback'
        ? namespaces.value
        : namespaces.value[0],
      reactiveOptions.keyPrefix
    )
  );

  const t = ((lng: any, ns: any, keyPrefix: any) => {
    ready.value;
    return tFunc.value(lng, ns, keyPrefix);
  }) as TFunction<N, TKPrefix>;

  watch(
    ready,
    () => {
      if (!ready.value) {
        i18n.loadNamespaces(namespaces.value);
      }
    },
    {
      immediate: true,
    }
  );

  const suspense = () =>
    new Promise<void>((resolve) => {
      let stopWatch = () => {};
      const run = () => {
        if (ready.value) {
          stopWatch();
          resolve();
        }
      };
      run();
      stopWatch = watch(ready, run);
    });

  return {
    suspense,
    ready,
    t,
    i18next: i18n,
  };
}
