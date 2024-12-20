export type GlobalParams = {
  DOMAIN?: string;
  LANG?: string;
  COUNTRY_ISO?: string;
  PID?: string;
  TRACK?: string;
  DL?: string;
  PARAM1?: string;
  PARAM2?: string;
  PARAM3?: string;
  PARAM4?: string;
};
// @ts-ignore
export const getGlobalParams = (): GlobalParams | null =>
  // @ts-ignore
  window.globalParams ||
  // @ts-ignore
  (typeof globalParams !== 'undefined' && globalParams) ||
  null;

export const createDomainLink = (path: string): string => {
  const gp = getGlobalParams();
  const domain = gp?.DOMAIN;
  if (!domain) {
    throw Error(DOMAIN_NOT_DEFINED);
  }
  const url = new URL(path, domain);
  gp?.TRACK && url.searchParams.set('track_id', gp.TRACK);
  gp?.PID && url.searchParams.set('pid', gp.PID);
  gp?.PARAM1 && url.searchParams.set('param1', gp.PARAM1);
  gp?.PARAM2 && url.searchParams.set('param2', gp.PARAM2);
  gp?.PARAM3 && url.searchParams.set('param3', gp.PARAM3);
  gp?.PARAM4 && url.searchParams.set('param4', gp.PARAM4);
  gp?.DL &&
    url.searchParams.set(
      'redirect',
      encodeURIComponent('/' + gp.DL.replace(/^\/+/, ''))
    );
  return url.toString();
};
export const createDomainLinkSafe = (path: string): string | null => {
  try {
    return createDomainLink(path);
  } catch (reason) {
    return null;
  }
};

export const getRedirectLink = () => {
  const link = window.__REDIRECT_LINK;
  return typeof link === 'string' && link.startsWith('http') ? link : null;
};

export const redirectToTDS = () => {
  const link = getRedirectLink();
  if (link) {
    window.location.href = link;
  }
};

export type RegFields = {
  email: string;
  password: string;
  captcha: string;
};
export const DOMAIN_NOT_DEFINED = 'DOMAIN_NOT_DEFINED';
export const UNDEFINED_ERROR = 'UNDEFINED_ERROR';

export const getApiConfiguration = async () => {
  const gp = getGlobalParams();
  const domain = gp?.DOMAIN;
  if (!domain) {
    throw [DOMAIN_NOT_DEFINED];
  }
  const response = await fetch(
    new URL('/api/v1/configuration', domain).toString(),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return await response.json();
};

export const sendRegistration = (fields: RegFields) => {
  const gp = getGlobalParams();
  const domain = gp?.DOMAIN;
  if (!domain) {
    return Promise.reject([DOMAIN_NOT_DEFINED]);
  }
  const data = {
    email: fields.email,
    password: fields.password,
    language: gp?.LANG ?? 'en',
    partnerId: gp?.PID ?? null,
    trackId: gp?.TRACK ?? null,
    param1: gp?.PARAM1 ?? null,
    param2: gp?.PARAM2 ?? null,
    param3: gp?.PARAM3 ?? null,
    param4: gp?.PARAM4 ?? null,
  };
  return new Promise<string>((resolve, reject) =>
    fetch(
      new URL(
        `/api/v3/auth/register/partners?captcha-response=${fields.captcha}`,
        domain
      ).toString(),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if ('playerToken' in data) {
          resolve(data.playerToken);
        }
        if ('errors' in data) {
          reject(data.errors);
          return;
        }
      })
      .catch(() => {
        reject([UNDEFINED_ERROR]);
      })
  );
};

export const redirectToAuth = (token: string) => {
  const gp = getGlobalParams();
  const domain = gp?.DOMAIN;
  if (!domain) {
    throw [DOMAIN_NOT_DEFINED];
  }
  let deeplink = gp?.DL ?? '/';
  deeplink = encodeURIComponent('/' + deeplink.replace(/^\/+/, ''));
  window.location.href = new URL(
    `/api/v3/auth/partners-player-entry?playerToken=${token}&deeplink=${deeplink}`,
    domain
  ).toString();
};

export const registrationProcess = async (fields: RegFields) => {
  const token = await sendRegistration(fields).catch((reason: unknown) => {
    if (!Array.isArray(reason)) {
      redirectToTDS();
    }
    if (
      Array.isArray(reason) &&
      reason.some((error) =>
        [
          'EMAIL_ALREADY_TAKEN',
          'PHONE_NUMBER_TAKEN',
          'COUNTRY_RESTRICTED',
          UNDEFINED_ERROR,
          DOMAIN_NOT_DEFINED,
        ].includes(error)
      )
    ) {
      redirectToTDS();
    }
    throw reason;
  });
  redirectToAuth(token);
};
