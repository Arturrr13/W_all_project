/** The example of your forms.js implementation*/

/**  Define vars **/
const formReg = $("#formReg");
const modalRegistration = $("#modalRegistration");
const errorBlock = $('#errormsg');
const errorEmail = $('#emailError');
const redirectLinks = $('.redirectLink');
const thanksModal = $('#modalThanks');
const accountField = thanksModal.find('.code');
const email = $('#email');
let dataEmail;
const VALID_DOMAINS = /@ukr.net$|@meta.ua$/;
const lang = document.documentElement.lang.length ? document.documentElement.lang.slice(0, 2).toLowerCase() : "uk";

/** Set **/
$(document).ready(function () {
  formReg.prop("onsubmit", null);
  formReg.find('button[type="button"]').prop('type', 'submit');
  //Remove when uxbtc will be ready for casino

  formReg.on("submit", function (e) {
    e.preventDefault();
    /** hide your errors block */
    if (!formReg.hasClass('notValid') && !$('body').hasClass('is-request')) {
      if (VALID_DOMAINS.test(email.val())) {
        let data = getFormData(formReg);
        sendApiRequest(data, successRegCallback, errorCallback, actionCallback);
      } else {
        makeEmailVerificationRequest(function () {
          formSend();
        });
      }
    }

  });
});


function formSend() {
  errorBlock.hide();
  if (dataEmail === "UNDELIVERABLE") {
    email.addClass("has-error");
    errorEmail.css('display', 'block');
    switch (lang) {
      case "uk":
        errorEmail.text("Електронна пошта не існує");
        break;
      case "ru":
        errorEmail.text("Электронная почта не существует");
        break;
      default:
        errorEmail.text("Email doesn't exist");
    }
  } else {
    /** Gather data from this form  */
    let data = getFormData(formReg);
    sendApiRequest(data, successRegCallback, errorCallback, actionCallback);
  }
}

const searchKey = (obj, target) =>
  target in obj
    ? obj[target]
    : Object.values(obj).reduce((acc, val) => {
      if (acc !== undefined) return acc;
      if (typeof val === "object") return searchKey(val, target);
    }, undefined);


function makeEmailVerificationRequest(callback) {
  dataEmail = '';
  stawkiLoader("body", "show");
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `https://emailvalidation.abstractapi.com/v1/?api_key=34e7f2016a49429291b634a41d2fc0ee&email=${email.val()}`);
  xhr.timeout = 4000;
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send();
  xhr.ontimeout = function () {
    stawkiLoader("body", "hide");
    callback();
  };
  xhr.onload = function () {
    stawkiLoader("body", "hide");
    let mData = JSON.parse(xhr.responseText);
    if (xhr.status === 200) {
      dataEmail = searchKey(mData, 'deliverability');
      callback();
    } else {
      console.log('Error-1');
      callback();
    }
  }
  xhr.onerror = function () {
    stawkiLoader("body", "hide");
    console.log('Error-2');
    callback();
  };
}


/** Your Callback-Functions **/

function successRegCallback(response) {
  let redirect = '';
  gtag('event', 'registration');
  /** Clearing the form */
  formReg[0].reset();
  /** Link to redirect user to be authorized */
  let redirectTo = response.redirectDomain;

  /** Change links that redirect your user to that one which Api returned */

  let tagParams = document.location.search;
  // let redirect = redirectTo + '/uk/' + tagParams;
  redirect = redirectTo + '/' + lang + '/deposit' + tagParams;

  window.location.href = redirect;
}

function errorCallback(response) {
   const loginLink = document.querySelector('.login-link')
  /** response.message is the error text to be shown for user */
  let message = response.message;
  triggerError(message);
  gtag('event', 'validation_error', {
    'error_message': message,
  });
  loginLink.addEventListener('click', function(e) {
    e.preventDefault();
    gtag('event', 'login');
    window.location.href = loginLink.href;
  })
}

function actionCallback(response) {
  /** Action needed */
  /** Example: action === "showSms" - need to show field with smsCode */
  let action = response.action;
  let message = response.message;

  if (action === "showSms") {
    /** Implement your logic to show sms field */
    // your logic here
    /** show an error */
    triggerError(message);
  }
}

/** Functions */
function triggerError(message) {
  errorBlock.show();
  errorBlock.text(message);
}

