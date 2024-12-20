/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/config.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! ./validation.js */ \"./src/validation.js\");\n\n//# sourceURL=webpack:///./src/config.js?");

/***/ }),

/***/ "./src/validation.js":
/*!***************************!*\
  !*** ./src/validation.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction emailValidate() {\n  var EMAIL_REGEXP = /^(?:(?:[\\w`~!#$%^*\\-=+;:{}'|,?\\/]+(?:(?:\\.(?:\"(?:\\\\?[\\w`~!#$%^*\\-=+;:{}'|,?\\/\\.()<>\\[\\] @]|\\\\\"|\\\\\\\\)*\"|[\\w`~!#$%^&*\\-=+;:{}'|,?\\/]+))*\\.[\\w`~!#$%^*\\-=+;:{}'|,?\\/]+)?)|(?:\"(?:\\\\?[\\w`~!#$%^*\\-=+;:{}'|,?\\/\\.()<>\\[\\] @]|\\\\\"|\\\\\\\\)+\"))@(?:[a-zA-Z\\d\\-]+(?:\\.[a-zA-Z\\d\\-]+)+|\\[\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\])$/;\n  var INVALID_DOMAINS = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\\.)+ru$|@eimatro.com$|@fulwark.com$|@extemer.com$|@dotvilla.com$|@fitwl.com$|@devswp.com$|@niback.com$|@nasskar.com$|@iturchia.com$|@dronetz.com$|@edulena.com$|@msback.com$|@meogl.com$|@mahmul.com$|@rambler.ua$|@lukaat.com$|@kameili.com$|@yahoo.com.br$|@sportrid.com$|@wiemei.com$|@quipas.com$|@inkiny.com$|@kkoup.com$|@mliok.com$|@rc3s.com$|@nmaller.com$|@paldept.com$|@ridteam.com$|@muzitp.com$|@semonir.com$|@sparkroi.com$|@miqlab.com$|@naymedia.com$|@zbock.com$|@zslsz.com$|@omeie.com$|@nezid.com$|@horsgit.com$|@picvw.com$|@searpen.com$|@nickolis.com$|@cohodl.com$|@chambile.com$|@gameszox.com$|@docwl.com$|@dragonhospital.net$|@viicard.com$|@rocketestate724.com$|@ducenc.com$|@iototal.com$|@zbock.com$|@zslsz.com$|@omeie.com$|@nezid.com$|@newnime.com$|@mkurg.com$|@jaja.com$|@jahah.com$|@hsja.com$|@othao.com$|@jaj.com$|@tui.com$|@ug.com$|@fyygug.com$|@fu.com$|@fug.com$|@ajja.com$|@uvhv.com$|@msjsj.com$|@vyuv.com$|@proton.me$|@outlook.com$|@rencr.com$|@mfyax.com$|@mailto.plus$|@fexpost.com$|@fexbox.org$|@mailbox.in.ua$|@rover.info$|@chitthi.in$|@fextemp.com$|@any.pink$|@merepost.com$|@emailbbox.pro$|@gufum.com$|@cateringegn.com$|@laste.ml$|@tgmk.laste.ml$|@clv.laste.ml$|@otw.laste.ml$|@jg.laste.ml$|@mdy.laste.ml$|@s3k.net$|@yopmail.com$|@hameatfirst.xyz$|@fex.plus$|@mx.fex.plus$|@vusra.com$|@haribu.com$|@mail.gufum.com$|@mail.haribu.com$|@mail.vusra.com$|@pointcaremedical.org$|@fincainc.com$|@huleos.com$|@javnoi.com$|@mcatag.com$|@crodity.com$|@adrais.com$|@acuxi.com$|@maildrop.cc$|@fuzitea.com$|@orsbap.com$|@maxturns.com$|@digdy.com$|@mvpalace.com$|@rowdydow.com$|@janfab.com$|@barakal.com$|@coloruz.com$|@rogtat.com$|@gmail.xom$|@gmsil.com$|@gnmm.jjj$|@gyuu.chh$|@huh.vhjj$|@divosvit.ukr.education$|@asaud.com$|@nastyx.com$|@expressletter.net$|@chrfeeul.com$|@heweek.com$|@inbox.lv$|@starmail.net$|@ghhh.com$|@sgatra.com$|@jofuso.com$|@rinseart.com$|@dntn2mfn.mailosaur.net$/;\n  var inputEmail = document.querySelector(\"#email\");\n  var errorMsgEm = document.querySelector(\".error-msg-email\");\n  var formReg = document.getElementById(\"formReg\");\n  var lang = document.documentElement.lang.length ? document.documentElement.lang.slice(0, 2).toLowerCase() : \"uk\";\n\n  function validateEmail() {\n    if (INVALID_DOMAINS.test(inputEmail.value)) {\n      inputEmail.classList.add(\"has-error\");\n      if (lang === \"ru\") {\n        errorMsgEm.innerHTML = \"Email с этим доменом недоступен для регистрации\";\n      } else {\n        errorMsgEm.innerHTML = \"Email з цим доменом недоступний для реєстрації\";\n      }\n      errorMsgEm.style.display = \"block\";\n      formReg.classList.add(\"notValid\");\n      return false;\n    } else if (!EMAIL_REGEXP.test(inputEmail.value)) {\n      inputEmail.classList.add(\"has-error\");\n      if (lang === \"ru\") {\n        errorMsgEm.innerHTML = \"Введите правильный почтовый адрес\";\n      } else {\n        errorMsgEm.innerHTML = \"Введи коректну адресу пошти\";\n      }\n      errorMsgEm.style.display = \"block\";\n      formReg.classList.add(\"notValid\");\n      return false;\n    } else {\n      inputEmail.classList.remove(\"has-error\");\n      errorMsgEm.innerHTML = \"\";\n      errorMsgEm.style.display = \"none\";\n      formReg.classList.remove(\"notValid\");\n      return true;\n    }\n  }\n\n  inputEmail.addEventListener(\"input\", function () {\n    validateEmail();\n  });\n  inputEmail.addEventListener(\"paste\", function () {\n    validateEmail();\n  });\n  inputEmail.addEventListener(\"cut\", function () {\n    validateEmail();\n  });\n}\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  emailValidate();\n});\n\n//# sourceURL=webpack:///./src/validation.js?");

/***/ })

/******/ });