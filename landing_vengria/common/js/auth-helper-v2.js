const url = window.location.protocol + '//' + window.location.hostname + '/handler.php';

const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4').then(FingerprintJS => FingerprintJS.load());
fpPromise
  .then(fp => fp.get())
  .then(result => {
    // This is the visitor identifier:
    const visitorId = result.visitorId;
    window.v_id = visitorId;
  })
  .catch(error => console.error(error));

const saveMode = true;

/** Helper for sending request **/
function sendApiRequest(
  data,
  successCallback = (response) => {
    successCbck(response)
  },
  errorCallback = (response) => {
    errorCbck(response)
  },
  actionCallback = (response) => {
    actionCbck(response)
  }) {

  stawkiLoader("body", "show");
  toggleRequestClass("body");

  if (typeof data['config'] === 'undefined')
    data['config'] = 'stawki.prj3';

  if (typeof data['CurrId'] === 'undefined')
    data['CurrId'] = 1;

  if (typeof data['lang'] === 'undefined')
    data['lang'] = 'uk';

  fetch(url.toString(), {
    method: "POST",
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/json",
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({
      ...data,
      clientId: window.v_id || '',
      channel: getXChannel() || '',
    }),
  }).then(response => response.json())
    .then(response => {
      stawkiLoader("body", "hide");

      let output = {};
      let login = false;
      let register = false;

      //debugger
      if (response.length !== 0) {
        //debugger
        if (response.authType === "register") register = true;
        if (response.authType === "login") login = true;

        if (response.error) {
          const errorText = response.hasOwnProperty('message') ? response.message : '';
          const apm_error_code = response.debugResult.errorCode ? response.debugResult.errorCode : '';

          if (typeof sendStat === "function") {
            if (login) {
              sendStat({
                'event': 'login',
                'eventCategory': 'login',
                'eventAction': 'login_error',
                'error_text': errorText,
                'landing_page_url': window.location.href,
                'landing_type': window.landing_type ? window.landing_type : ''
              });
            }

            if (register) {
              sendStat({
                'event': 'registration',
                'eventCategory': 'registration',
                'eventAction': 'registration_error',
                'reg_type': window.nnbonus || 'landing',
                'error_text': errorText,
                'landing_page_url': window.location.href,
                'landing_type': window.landing_type ? window.landing_type : '',
                'apm_error_code': apm_error_code
              });
            }
          }

          errorCallback(response);
        } else if (response.success || response.result === 'success') {

          const domain = window.location.hostname.replace('go.', '');

          /** prepare redirect domain */
          if (typeof response.tokens !== "undefined" && typeof response.tokens.redirectDomain !== "undefined")
            response.redirectDomain = prepareRedirectDomain(response.tokens.redirectDomain, domain);
          else
            response.redirectDomain = 'https://' + domain;

          if (typeof sendStat === "function") {
            if (login) {
              sendStat({
                'event': 'login',
                'eventCategory': 'login',
                'eventAction': 'login_success',
                'landing_page_url': window.location.href,
                'landing_type': window.landing_type ? window.landing_type : '',
                'user_id_hash': response.account_hash || response.res.account_hash || response.data.account_hash || '',
              });
              try{
                if(typeof MTFEF !== "undefined" && typeof MTFEF.loginCallback === "function"){
                  MTFEF.loginCallback();
                }
              } catch (e) {
                console.log(e);
              }
            }

            if (register) {
              sendStat({
                'event': 'registration',
                'eventCategory': 'registration',
                'eventAction': 'registration_success',
                'landing_page_url': window.location.href,
                'reg_type': window.nnbonus || 'landing',
                'landing_type': window.landing_type ? window.landing_type : '',
                'user_id_hash': response.account_hash || response.res.account_hash || response.data.account_hash || '',
              });
            }
            try{
              if(typeof MTFEF !== "undefined" && typeof MTFEF.registerCallback === "function"){
                MTFEF.registerCallback()
              }
            } catch (e) {
              console.log(e);
            }
          }

          const accInfo = ['phone', 'phoneCountry', 'email', 'currency', 'accountEnter', 'blockTime'];

          accInfo.forEach((item) => {
            if (localStorage.getItem(item)) {
              localStorage.removeItem(item);
            }
          });

          successCallback(response);

        } else if (response.action === 'showFa' || response.action === 'showSms')
          actionCallback(response);

      } else {
        output = {error: true, message: "Попробуйте позже."};
        errorCallback(output);
      }

      setTimeout(function () {
        toggleRequestClass("body");
      }, 1000)
    })
}

function prepareRedirectDomain(redirectDomain, domain) {
  let res = redirectDomain;
  if (domain !== 'stawki.bet') {
    // its COM mirror
    res = redirectDomain.replace('stawki.bet', domain);
  }

  return 'https://' + res;
}

/** Callback for success response */
function successCbck(response) {
  console.log(response);
}

/** Callback for error response */
function errorCbck(response) {
  let msg = " Error callback triggered : " + response.message;
  console.log(msg);
}

/** Callback for action response */
function actionCbck(response) {
  console.log(response);
}

/** check is mobile **/
function isMobile() {
  let width = window.innerWidth;
  return width < 1280 ? 1 : 0
}

function isCloak() {
  const agents = [
    'WebView',
    '(iPhone|iPod|iPad)(?!.*Safari)',
    'Android.*(wv|.0.0.0)',
    'Linux; U; Android'
  ];
  const webviewRegExp = new RegExp('(' + agents.join('|') + ')', 'ig')
  return !!navigator.userAgent.match(webviewRegExp);
}

/** Form serializing **/
function getFormData($form) {
  let unindexed_array = $form.serializeArray(),
    indexed_array = {};

  unindexed_array.map((n)=>{
    indexed_array[n['name']] = n['value'];
  });

  /** Add marketingSources for reg **/
  indexed_array['marketingSources'] = JSON.stringify(collectCookies());
  /** Add isMobile for reg **/
  indexed_array['isMobile'] = isMobile();
  indexed_array['isCloak'] = isCloak();

  return Object.assign(getLastCookie(), indexed_array);
}

/** Loader toggle function **/
function stawkiLoader(wrapperCls, state) {
  const LOADER_CLASS = "js-loader";
  const IS_LOADING_CLASS = "is-loading";
  const loaderTpl = `<div class="c-loader ${LOADER_CLASS} ${IS_LOADING_CLASS}">
                       <div class="c-loader__content">
                         <img src="public/images/loader.gif" class="c-loader__item" alt="loader">  
                       </div>
                     </div>`;

  if (state === "show") {
    const wrapper = document.getElementsByTagName(wrapperCls)[0];
    wrapper.insertAdjacentHTML("afterbegin", loaderTpl);
  } else if (state === "hide") {
    const loader = document.querySelector(`.${LOADER_CLASS}`);
    loader.classList.remove(`.${IS_LOADING_CLASS}`);
    setTimeout(() => loader.parentNode.removeChild(loader), 300);
  } else {
    console.log("Unrecognized state");
  }
}

function toggleRequestClass(cls) {
  const item = document.querySelector(cls);
  item.classList.toggle('is-request');
}


/** Cookies **/
function getCookie(name) {
  return window.MTFEF.getCookie(name);
}

function collectCookies() {
  // MarketingTech Framework integration
  if (window.MTFEF && window.MTFEF.collectSources) {
    try {
      let sources = window.MTFEF.collectSources();
      if (sources) {
        // Nested JSON Object .
        return sources;
      }
    } catch (e) {
      console.log(e);
    }
  }

  let cookieSet = {
    'adtag': getCookie('adtag'),
    'btag': getCookie('pm_btag'),
    'siteid': getCookie('pm_siteid'),
    'qtag': getCookie('qtag'),
    'adtag_t': getCookie('adtag_t'),
    'btag_t': getCookie('btag_t'),
    'qtag_t': getCookie('qtag_t'),
    'org': getCookie('org'),
    'org_t': getCookie('org_t'),
    'sourceURL': getCookie('sourceUrl'),
    'iohash': getCookie('iohash')

  };

  for (let key in cookieSet) {
    if (typeof cookieSet[key] === "undefined")
      delete cookieSet[key];
  }

  return cookieSet;
}

function getLastCookie() {
  let data = {},
    lastCookieTime = 0,
    adtag_t = getCookie('adtag_t'),
    btag_t = getCookie('btag_t'),
    qtag_t = getCookie('qtag_t');

  adtag_t = typeof adtag_t !== 'undefined' ? parseInt(adtag_t) : 0;
  btag_t = typeof btag_t !== 'undefined' ? parseInt(btag_t) : 0;
  qtag_t = typeof qtag_t !== 'undefined' ? parseInt(qtag_t) : 0;

  lastCookieTime = Math.max(adtag_t, btag_t, qtag_t);

  switch (lastCookieTime) {
    case qtag_t:
      data['qtag'] = getCookie('qtag');
      break;
    case btag_t:
      data['btag'] = getCookie('pm_btag');
      break;
    case adtag_t:
      data['adtag'] = getCookie('adtag');
      break;
  }

  return data;
}


/** sending stats */
function sendStat(data) {
  if (typeof dataLayer !== "undefined" && typeof data === "object") {
    dataLayer.push(data);
  }
}

let startFormSent = 0;

function handleInputs() {
  const passInput = document.querySelector('input[type="password"]');
  if (!!passInput && !passInput.length) {
    const parent_form = passInput.closest('form');
    const form_inputs = parent_form.querySelectorAll('input');
    const form_selects = parent_form.querySelectorAll('select');

    form_inputs.forEach((input) => {
      input.addEventListener('change', sendStartFormEdit)
    })

    form_selects.forEach((select) => {
      select.addEventListener('change', sendStartFormEdit)
    })
  }
}

handleInputs();

function sendStartFormEdit() {
  if (startFormSent === 0) {
    startFormSent = 1;
    if (typeof sendStat === "function") {
      /*sendStat({
        'event': 'registration',
        'eventCategory': 'registration',
        'eventAction': 'registration_start',
        'eventLabel': window.location.href
      })*/
    }
  }
}

function getXChannel() {
  const VIEW_MODES = {
    SIMPLE: 'simple',
    WIDE: 'wide',
  };

  //wideViewThreshold
  const wideViewThreshold = 1280;

  //rules
  const rules = [
    'WebView',
    '(iPhone|iPod|iPad)(?!.*Safari)',
    'Android.*(wv|.0.0.0)',
    'Linux; U; Android',
  ];

  //pwa.installed
  const isInStandaloneMode = () =>
    ('standalone' in window.navigator && window.navigator.standalone) ||
    window.matchMedia('(display-mode: standalone)').matches;

  const getViewMode = () => window.innerWidth < wideViewThreshold ? VIEW_MODES.SIMPLE : VIEW_MODES.WIDE;

  const checkUserAgent = (regExp, userAgentRaw) => {
    const userAgent = userAgentRaw.toLowerCase();

    if (!(regExp || regExp instanceof RegExp)) {
      throw new Error(
        `${JSON.stringify(
          regExp,
        )} isn't instance of RegExp, need pass only instance ofRegExp - /xxx/ or new RegExp('xxx', flags)`,
      );
    }

    return regExp.test(userAgent);
  };

  const isWebView = () =>
    checkUserAgent(
      new RegExp(`(${rules.join('|')})`, 'i'),
      window.navigator.userAgent,
    ) && !window.navigator.userAgent.toLocaleLowerCase().includes('build');


  const getChannel = (viewMode, pwa, webView) => {
    const isWideView = viewMode === VIEW_MODES.WIDE;

    if (webView) {
      return 'MOBILE_WEB';
    }

    if (pwa) {
      return 'PWA';
    }

    if (isWideView) {
      return 'DESKTOP_AIR_PM';
    }

    return 'MOBILE_WEB';
  };

  return getChannel(getViewMode(), isInStandaloneMode(), isWebView());
}

if (saveMode) {
  function setPhoneEmail(item) {
    const $this = item;
    if ($this.getAttribute('name') === 'telno') {
      const phoneValue = $this.value;
      const phoneSelect = document.getElementById("phone_code");
      const phoneCountry = phoneSelect.options[phoneSelect.selectedIndex].getAttribute("data-countrycode");
      localStorage.setItem('phone', phoneValue);
      localStorage.setItem('phoneCountry', phoneCountry);
    } else if ($this.getAttribute('type') === 'email') {
      const emailValue = $this.value.length > 0 ? $this.value : '';
      localStorage.setItem('email', emailValue);
    }
    const CurrentTime = new Date();
    CurrentTime.setMinutes(CurrentTime.getMinutes() + 15);
    localStorage.setItem('blockTime', +CurrentTime);
  }

  function setUsersInfo() {
    const inputs = document.querySelectorAll('input');
    const selects = document.querySelectorAll('select');

    const typeChange = document.querySelectorAll('.js-btn-type-change');

    if (typeChange.length) {
      typeChange[0].nextElementSibling.addEventListener('change', () => {
        setPhoneEmail(typeChange[0].nextElementSibling);
      });
    }

    inputs.forEach((input) => {
      if (input.getAttribute("name") === 'telno') {
        input.onchange = () => {
          if (input.getAttribute("name") === 'telno') {
            const phoneValue = input.value;
            const phoneSelect = document.getElementById("phone_code");
            const phoneCountry = phoneSelect.options[phoneSelect.selectedIndex].getAttribute("data-countrycode");
            localStorage.setItem('phone', phoneValue);
            localStorage.setItem('phoneCountry', phoneCountry);
            const CurrentTime = new Date();
            CurrentTime.setMinutes(CurrentTime.getMinutes() + 15);
            localStorage.setItem('blockTime', +CurrentTime);
          }
          if (input.getAttribute("name") === 'email') {
            const emailValue = input.value.length > 0 ? input.value : '';
            localStorage.setItem('email', emailValue);
            const CurrentTime = new Date();
            CurrentTime.setMinutes(CurrentTime.getMinutes() + 15);
            localStorage.setItem('blockTime', +CurrentTime);
          }
        };
      }

      if (input.getAttribute("type") === 'email') {
        input.addEventListener('change', () => {
          const emailValue = input.value.length > 0 ? input.value : '';
          localStorage.setItem('email', emailValue);
          const CurrentTime = new Date();
          CurrentTime.setMinutes(CurrentTime.getMinutes() + 15);
          localStorage.setItem('blockTime', +CurrentTime);
        });
      }

      if (input.getAttribute("name") === 'acc') {
        input.addEventListener('change', () => {
          const accValue = input.value.length > 0 ? input.value : '';
          localStorage.setItem('accountEnter', accValue);
          const CurrentTime = new Date();
          CurrentTime.setMinutes(CurrentTime.getMinutes() + 15);
          localStorage.setItem('blockTime', +CurrentTime);
        });
      }

    });

    selects.forEach((select) => {
      if (select.getAttribute('name') === 'CurrId') {
        select.addEventListener('change', () => {
          const currencyValue = select.value;
          localStorage.setItem('currency', currencyValue);
        })
      }
    });
  }

// block time
  (function () {
    const blockTime = localStorage.getItem('blockTime');
    if (blockTime !== null) {

      if (+new Date() >= parseInt(blockTime)) {
        localStorage.removeItem('phone');
        localStorage.removeItem('phoneCountry');
        localStorage.removeItem('email');
        localStorage.removeItem('currency');
        localStorage.removeItem('accountEnter');
        localStorage.removeItem('blockTime');
      }
    }
  })();

  document.addEventListener('DOMContentLoaded', function(){
    const inputs = document.querySelectorAll('input');
    const selects = document.querySelectorAll('select');

    const phoneValue = localStorage.getItem('phone');
    const emailValue = localStorage.getItem('email');
    const currencyValue = localStorage.getItem('currency');
    const accValue = localStorage.getItem('accountEnter');

    inputs.forEach((input) => {
      if (phoneValue && input.getAttribute("name") === 'telno') {
        setTimeout(() => {
          input.value = phoneValue;
          input.setAttribute("data-valid", true);
          input.closest('.c-form__group').classList.add('focused');
        }, 500);
      }

      if (phoneValue && input.getAttribute("type") === 'email') {
        const emailBlock = document.querySelector('.form_box--email');
        if (emailBlock) {
          emailBlock.classList.add('statick');
        }
        setTimeout(() => {
          input.value = emailValue;
          input.setAttribute("data-valid", true);
          input.closest('.c-form__group').classList.add('focused');
        }, 500);
      }

      if (accValue && input.getAttribute("name") === 'acc') {
        const accValue = localStorage.getItem('accountEnter');
        setTimeout(() => {
          input.value = accValue;
          input.setAttribute("data-valid", true);
          input.closest('.c-form__group').classList.add('focused');
        }, 500);
      }
    });

    selects.forEach((select) => {
      if (select.getAttribute('name') === 'CurrId') {
        if (currencyValue && select.options[select.selectedIndex].value !== currencyValue) {
          setTimeout(() => {
            select.value = currencyValue;
            const inputBrandConfig = document.getElementById('brandConfig');
            if (!!inputBrandConfig) {
              const brandConfig = select.options[select.selectedIndex].getAttribute('data-config');
              inputBrandConfig.value = brandConfig;
              select.closest('.c-form__group').classList.add('focused');
            }
          }, 500);
        }
      }
    });

    setUsersInfo();

  });
}
