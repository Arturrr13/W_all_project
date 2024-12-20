<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
  sameAs,
} from '@vuelidate/validators';
import { computed, onMounted, reactive, ref, unref, watch, defineProps, defineEmits  } from 'vue';
import { VueRecaptcha } from 'vue-recaptcha';
import { useToast } from 'vue-toastification';
import FieldCheckbox from '@/components/FieldCheckbox.vue';
import FieldInput from '@/components/FieldInput.vue';
import SvgIcon from '@/components/SvgIcon.vue';

import {
  createDomainLinkSafe,
  getApiConfiguration,
  redirectToTDS,
  registrationProcess,
} from '@/lib';

import { useTranslation } from '@/composition/useTranslation';
import { useTemplateRefsList } from '@vueuse/core'
  import { getLanguagePartFromCode } from '@/utils'

const toast = useToast();
const { t, i18next } = useTranslation('common');

/**
 * Configuration
 */
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


/**
 * Links
 */
const termsLink = createDomainLinkSafe('terms-and-conditions') || undefined;
const googleSignInLink = createDomainLinkSafe(
  '/api/oauth2/authorization/google'
);
const facebookSignInLink = createDomainLinkSafe(
  '/api/oauth2/authorization/facebook'
);
const appleSignInLink = createDomainLinkSafe('/api/oauth2/authorization/apple');

/**
 * Registration
 */
//const defaultCountry = getGlobalParams()?.COUNTRY_ISO || undefined;
const recaptchaRef = ref<VueRecaptcha | null>(null);
const submitting = ref(false);

// const rawPhone = ref('');
// const phoneValid = ref(false);ц

const terms = ref(true);

const props = defineProps({
  formSubmit: Boolean,
  acitve: Boolean
})

const emit = defineEmits(['formSuccess', 'close'])

const data = reactive({
  email: '',
  password: '',
  captcha: '',
});

const siteKey = import.meta.env.VUE_APP_CAPTCHA_KEY as string;
const siteKeyDev = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

const v$ = useVuelidate(
  computed(() => ({
    email: {
      required: helpers.withMessage(
        () => t('validation.emailRequired'),
        required
      ),
      email: helpers.withMessage(() => t('validation.emailFormat'), email),
      maxLength: helpers.withMessage(
        ({ $params }) => t('validation.maxLength', { count: $params.max }),
        maxLength(256)
      ),
    },
    password: {
      required: helpers.withMessage(
        () => t('validation.passwordRequired'),
        required
      ),
      minLength: helpers.withMessage(
        ({ $params }) =>
          t('validation.passwordMinLength', { count: $params.min }),
        minLength(6)
      ),
      maxLength: helpers.withMessage(
        ({ $params }) => t('validation.maxLength', { count: $params.max }),
        maxLength(25)
      ),
      excludeChars: helpers.withMessage(
        () => t('validation.passwordFormat'),
        helpers.regex(new RegExp('^[^^\'"`]*$'))
      ),
      hasUpperCase: helpers.withMessage(
        () => t('validation.passwordNoUppercase'),
        helpers.regex(new RegExp('[A-Z]'))
      ),
      hasDigit: helpers.withMessage(
        () => t('validation.passwordNoDigit'),
        helpers.regex(new RegExp('[0-9]'))
      ),
    },
    terms: {
      boolean: sameAs(true),
    },
    captcha: {
      required,
    },
  })),
  computed(() => ({
    ...data,
    terms: terms.value,
  }))
);

const onSubmit = async (e: Event) => {
  e.preventDefault();
  const formIsValid = await v$.value.$validate();
  console.log(formIsValid)
  if (!formIsValid) {
    v$.value.$touch();
    return;
  }

  submitting.value = true;
  try {
    await registrationProcess(data)
  } catch (errors) {
    if (Array.isArray(errors)) {
      errors.forEach((error) =>
        toast.error(t([`errors.${error}`, 'errors.UNDEFINED_ERROR']) as string)
      );
    } else {
      toast.error(t('errors.UNDEFINED_ERROR') as string);
    }
    data.captcha = '';
    recaptchaRef.value?.reset();
  } finally {
    submitting.value = false
    //emit('formSuccess')
  }
};


watch(
  () => props.formSubmit, (value, old) => {
    if (value === true) {
      onSubmit()
    }
  },
);


function ScaleReCaptcha(recaptcha: any) {
  if (recaptcha) {
    
    const parentWidth = recaptcha.clientWidth;
    const childWidth = recaptcha.querySelector('iframe').clientWidth;
    const scale = (parentWidth) / (childWidth);
    
    recaptcha.querySelector("iframe").style.transform = 'scale(' + scale + ')';
    recaptcha.querySelector("iframe").style.transformOrigin = '0 0';

    recaptcha.querySelector('.form__capcha').style.width = `${recaptcha.dataset.width * scale}px`;
    //recaptcha.querySelector('.form__capcha').style.height = `${recaptcha.dataset.height * scale}px`;
  }
}

function recaptchaInit(recaptcha: any) {
  const recaptchaInterval = setInterval(() => {
    console.log('recaptchaInit',recaptcha)
    if (recaptcha && recaptcha.querySelector('iframe') !== null) {
      recaptcha.dataset.width = recaptcha.offsetWidth;
      recaptcha.dataset.height = recaptcha.offsetHeight;
      
      ScaleReCaptcha(recaptcha)

      clearInterval(recaptchaInterval);
      return;
    }
  }, 1050);
  
  window.onresize = () => {
    ScaleReCaptcha(recaptcha)
  }
}

const refs = useTemplateRefsList<HTMLDivElement>()

onMounted(() => {
  recaptchaInit(refs.value[0])
})


const capchaSIze = window.innerWidth <= 768 ? 'compact' : 'normal';

window.addEventListener('DOMContentLoaded', (event) => {
  const recapchDiv = document.getElementById("recaptcha-div");
  if ( recapchDiv!== null) {
    if (window.innerWidth < 768) {
      recapchDiv.setAttribute('data-size','compact');
    }else{
      recapchDiv.setAttribute('data-size','normal');
    };
  };
});


const close = ref(false)
const validation = ref({
    email: false,
    password: false,
    checkbox: false
})

const closePopUp = () => {
    close.value = true
    
    setTimeout(() => {
        close.value = false
        emit('close')
    }, 350)
}
</script>

<template>
	<div class="popUp" :class="{ active: props.acitve, close: close }">
		<div class="form__box">
			<form class="form__form form" autocomplete="off" novalidate @submit="onSubmit">
				<div class="form__head">
					<img :src="`img/popUp-${getLanguagePartFromCode(i18next.language)}.png`" alt="zeus">
          <div class="form__head--titleBlock">
            <div class="logo">
              <!-- <a href="#">
                  <img src="/img/logo.png" alt="weiss">
              </a> -->
<!-- 
              <p class="playWin">
                <b>
                <span v-html="t('main.playWin1')"></span><br>
                </b>
                <span v-html="t('main.playWin2')"></span><br>
                <b style="margin-top: .1em; display: inline-block;">
                  {{ t('main.playWin3') }}
                </b>
              </p> -->
            </div>
          </div>
				</div>

				<div class="form__padd">
          <FieldInput class="form__emailInput" name="email" icon="email" type="email"
						:placeholder="t('form.email')" 
						v-model="data.email"
						:error="unref(v$.email?.$errors[0]?.$message)" 
						@blur="v$.email?.$touch!" 
					/>
	
					<FieldInput name="password" icon="lock" type="password" 
						:placeholder="t('form.password')"
						v-model="data.password" 
						:error="unref(v$.password?.$errors[0]?.$message)"
						@blur="v$.password?.$touch!" 
					/>
	
					<div :ref="refs.set">
						<div class="form__item form__item_recaptcha" ref="recaptchaRef">
							<VueRecaptcha 
								v-if="apiConfiguration" class="form__capcha"
								:sitekey="apiConfiguration.captchaSiteKey"
								@verify="data.captcha = $event"
								@expired="data.captcha = ''" 
							/>
						</div>
					</div>
	
					<div class="row">
						<div class="terms form__agreeBlock">
							<FieldCheckbox class="termsCheckbox" v-model="terms"
								:invalid="v$.terms.$dirty && v$.terms.$invalid" @blur="v$.terms?.$touch!" />
              <span class="form__agreeBlock--text">
								<span>{{ t('form.iAgreeWith') }}
									<a :href="termsLink">
										{{ t('form.termsAndConditions') }}
									</a>
								</span>
							</span>
						</div>
					</div>

          <div class="form__item">
						<div class="form__submit">
							<button class="btn form__btn" :disabled="submitting">
								<span>
									{{ t('form.createAccount') }}
								</span>
							</button>
						</div>
					</div>
				</div>


				<div type="button" class="form__closeBtn" @click="closePopUp">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
						<mask id="mask0_883_2158" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
							<rect width="24" height="24" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_883_2158)">
							<path d="M12 13.4L7.10005 18.3C6.91672 18.4834 6.68338 18.575 6.40005 18.575C6.11672 18.575 5.88338 18.4834 5.70005 18.3C5.51672 18.1167 5.42505 17.8834 5.42505 17.6C5.42505 17.3167 5.51672 17.0834 5.70005 16.9L10.6 12L5.70005 7.10005C5.51672 6.91672 5.42505 6.68338 5.42505 6.40005C5.42505 6.11672 5.51672 5.88338 5.70005 5.70005C5.88338 5.51672 6.11672 5.42505 6.40005 5.42505C6.68338 5.42505 6.91672 5.51672 7.10005 5.70005L12 10.6L16.9 5.70005C17.0834 5.51672 17.3167 5.42505 17.6 5.42505C17.8834 5.42505 18.1167 5.51672 18.3 5.70005C18.4834 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4834 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4834 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4834 18.1167 18.3 18.3C18.1167 18.4834 17.8834 18.575 17.6 18.575C17.3167 18.575 17.0834 18.4834 16.9 18.3L12 13.4Z" fill="white" />
						</g>
					</svg>
				</div>
			</form>
		</div>
	</div>
</template>
<style>
  .form__head--titleBlock .playWin small{
    font-size: .75em;
  }
</style>
<style lang="scss" scoped>
.popUp {
	background: rgba(0, 0, 0, 0.60);
	backdrop-filter: blur(em(5));
	position: fixed;
	top: 0;
	width: 100dvw;
	height: 100%;
	z-index: 10;
	display: none;
	animation: openPopUp .25s linear both;
	&.active {
		@include flex(false, center, center, false);
	}

	&.close {
		animation: closePopUp .25s linear both;
	}
}

.form{
    position: relative;
    width: em(480);
    border-radius: em(32);
    background: #0F0C28;

    &__head{
        width: 100%;
        position: relative;
        img{
            border-radius: em(32) em(32) 0 0;
        }

        &--titleBlock{
          position: absolute;
          top: em(28);
          left: em(24);

          .logo{
            a{
              width: em(152);
              display: block;
            }
            img{
              border-radius: 0;
            }
          }
          .playWin{
            @include text(#fff, em(32), 400, 1);
            text-transform: uppercase;
            text-wrap: nowrap;
            padding-top: em(15);
          }
          
        }
    }

    &__padd{
        width: 100%;
        padding: em(16) em(24) em(24) em(24);
    }

    &__closeBtn{
        width: em(40);
        height: em(40);
        border-radius: em(12);
        background: #FFFFFF29;
        @include flex(false, center, center, false);
        backdrop-filter: blur(em(7));
        transition: all .35s ease-in-out;
        position: absolute;
        top: em(25);
        right: em(25);
        svg{
            width: em(24);
            height: em(24);
        }
        &:hover{
            cursor: pointer;
            background: #ff3333;
        }
    }

    &__emailInput{
        margin-bottom: em(16);
    }

    &__agreeBlock{
        @include flex(false, center, false, em(12));
        padding: em(24) 0 em(32);
        &--checkbox{
            width: em(22);
            height: em(22);
            border-radius: em(2);
            border: em(1) solid #8885FD;
            @include flex(false, center, center, false);
            flex-shrink: 0;
            transition: all .25s ease;
            &:hover{
                box-shadow: 0 0 0 em(1) #8885FD;
                cursor: pointer;
            }
            &.active{
                background: #8885FD;
                &::after{
                    content: '';
                    width: em(10);
                    height: em(10);
                    border-bottom: em(3) solid #0F0C28;
                    border-left: em(3) solid #0F0C28;
                    transform: rotate(-45deg);
                }
                &:hover{
                    background: transparent;
                    &::after{
                        border-color: #8885FD;
                    }
                }
            }
        }
        &--text{
            @include text(#fff, em(12), 400, 120%);
            text-align: start;
			a{
				@include text(#fff, 1em, 400, 120%);
			}
        }
    }

    &__btn{
        width: 100%;
        position: relative;
		padding: em(15) 0;
		border-radius: em(16);
		@include text(#fff, em(18), 400, 1em);

        &:disabled{
            opacity: 0.75;
            background: #ff3333;
            color: #FFF;

            &:hover{
                cursor: not-allowed;
            }
        }

    }
}

.captcha {
	display: block;
	// display: flex;
	// justify-content: center;
}

.form__capcha{
  height: fit-content;
  padding-top: em(5);
}

@keyframes openPopUp {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}

@keyframes closePopUp {
	0% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
}
</style>


<!-- <script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
  sameAs,
} from '@vuelidate/validators';
import { computed, onMounted, reactive, ref, unref, watch, defineProps, defineEmits  } from 'vue';
import { VueRecaptcha } from 'vue-recaptcha';
import { useToast } from 'vue-toastification';
import FieldCheckbox from '@/components/FieldCheckbox.vue';
import FieldInput from '@/components/FieldInput.vue';
// import FieldPhone from '@/components/FieldPhone.vue';
import SvgIcon from '@/components/SvgIcon.vue';

import {
  createDomainLinkSafe,
  getApiConfiguration,
  redirectToTDS,
  registrationProcess,
} from '@/lib';

import { useTranslation } from '@/composition/useTranslation';
import { useTemplateRefsList } from '@vueuse/core'

const toast = useToast();
const { t, i18next } = useTranslation('common');

/**
 * Configuration
 */
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


/**
 * Links
 */
const termsLink = createDomainLinkSafe('terms-and-conditions') || undefined;
const googleSignInLink = createDomainLinkSafe(
  '/api/oauth2/authorization/google'
);
const facebookSignInLink = createDomainLinkSafe(
  '/api/oauth2/authorization/facebook'
);
const appleSignInLink = createDomainLinkSafe('/api/oauth2/authorization/apple');

/**
 * Registration
 */
// const defaultCountry = getGlobalParams()?.COUNTRY_ISO || undefined;
const recaptchaRef = ref<VueRecaptcha | null>(null);
const submitting = ref(false);

// const rawPhone = ref('');
// const phoneValid = ref(false);ц

const terms = ref(true);

const props = defineProps({
  formSubmit: Boolean,
  acitve: Boolean
})

const emit = defineEmits(['formSuccess', 'close'])

const data = reactive({
  // phone: '',
  email: '',
  password: '',
  captcha: '',
});

const siteKey = import.meta.env.VUE_APP_CAPTCHA_KEY as string;
const siteKeyDev = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

const v$ = useVuelidate(
  computed(() => ({
    email: {
      required: helpers.withMessage(
        () => t('validation.emailRequired'),
        required
      ),
      email: helpers.withMessage(() => t('validation.emailFormat'), email),
      maxLength: helpers.withMessage(
        ({ $params }) => t('validation.maxLength', { count: $params.max }),
        maxLength(256)
      ),
    },
    password: {
      required: helpers.withMessage(
        () => t('validation.passwordRequired'),
        required
      ),
      minLength: helpers.withMessage(
        ({ $params }) =>
          t('validation.passwordMinLength', { count: $params.min }),
        minLength(6)
      ),
      maxLength: helpers.withMessage(
        ({ $params }) => t('validation.maxLength', { count: $params.max }),
        maxLength(25)
      ),
      excludeChars: helpers.withMessage(
        () => t('validation.passwordFormat'),
        helpers.regex(new RegExp('^[^^\'"`]*$'))
      ),
      hasUpperCase: helpers.withMessage(
        () => t('validation.passwordNoUppercase'),
        helpers.regex(new RegExp('[A-Z]'))
      ),
      hasDigit: helpers.withMessage(
        () => t('validation.passwordNoDigit'),
        helpers.regex(new RegExp('[0-9]'))
      ),
    },
    // phone: {
    //   required: helpers.withMessage(
    //     () => t('validation.phoneRequired'),
    //     required
    //   ),
    //   correct: helpers.withMessage(
    //     () => t('validation.phoneFormat'),
    //     () => phoneValid.value
    //   ),
    // },
    terms: {
      boolean: sameAs(true),
    },
    // captcha: {
    //   required,
    // },
  })),
  computed(() => ({
    ...data,
    // phone: rawPhone.value,
    terms: terms.value,
  }))
);

const onSubmit = async (e: Event) => {
  e.preventDefault();
  const formIsValid = await v$.value.$validate();
  console.log(formIsValid)
  if (!formIsValid) {
    v$.value.$touch();
    return;
  }

  submitting.value = true;
  try {
    await registrationProcess(data);

  } catch (errors) {
    if (Array.isArray(errors)) {
      errors.forEach((error) =>
        toast.error(t([`errors.${error}`, 'errors.UNDEFINED_ERROR']) as string)
      );
    } else {
      toast.error(t('errors.UNDEFINED_ERROR') as string);
    }
    data.captcha = '';
    recaptchaRef.value?.reset();
  } finally {
    submitting.value = false;

    emit('formSuccess');
  }
};

watch(
  () => props.formSubmit, (value, old) => {
    if (value === true) {
      onSubmit()
    }
  },
);


function ScaleReCaptcha(recaptcha: any) {
  if (recaptcha) {
    
    const parentWidth = recaptcha.clientWidth;
    const childWidth = recaptcha.querySelector('iframe').clientWidth;
    const scale = (parentWidth) / (childWidth);
    
    recaptcha.querySelector("iframe").style.transform = 'scale(' + scale + ')';
    recaptcha.querySelector("iframe").style.transformOrigin = '0 0';

    recaptcha.querySelector('.form__capcha').style.width = `${recaptcha.dataset.width * scale}px`;
    recaptcha.querySelector('.form__capcha').style.height = `${recaptcha.dataset.height * scale}px`;
  }
}

function recaptchaInit(recaptcha: any) {
  const recaptchaInterval = setInterval(() => {
    console.log('recaptchaInit',recaptcha)
    if (recaptcha && recaptcha.querySelector('iframe') !== null) {
      recaptcha.dataset.width = recaptcha.offsetWidth;
      recaptcha.dataset.height = recaptcha.offsetHeight;
      
      ScaleReCaptcha(recaptcha)

      clearInterval(recaptchaInterval);
      return;
    }
  }, 1050);
  
  window.onresize = () => {
    ScaleReCaptcha(recaptcha)
  }
}

const refs = useTemplateRefsList<HTMLDivElement>()

onMounted(() => {
  recaptchaInit(refs.value[0])
})


// const capchaSIze = window.innerWidth <= 768 ? 'compact' : 'normal';

// window.addEventListener('DOMContentLoaded', (event) => {
//   const recapchDiv = document.getElementById("recaptcha-div");
//   if ( recapchDiv!== null) {
//     if (window.innerWidth < 768) {
//       recapchDiv.setAttribute('data-size','compact');
//     }else{
//       recapchDiv.setAttribute('data-size','normal');
//     };
//   };
// });


</script>

<template>
  <div class="form__box popUp" :class="{ active: props.acitve, close: close }">
   
  
    <form
      class="form__form"
      autocomplete="off"
      novalidate
      @submit="onSubmit"
    >
      
        <FieldInput
          name="email"
          icon="email"
          type="email"
          :placeholder="t('form.email') || ''"
          v-model="data.email"
          :error="unref(v$.email?.$errors[0]?.$message)"
          @blur="v$.email?.$touch!"
        />
      
        <FieldInput
          name="password"
          icon="lock"
          type="password"
          :placeholder="t('form.password') || ''"
          v-model="data.password"
          :error="unref(v$.password?.$errors[0]?.$message)"
          @blur="v$.password?.$touch!"
        />
      <div :ref="refs.set">
        <div class="form__item form__item_recaptcha" ref="recaptchaRef">
          <VueRecaptcha
            v-if="siteKey"
            class="form__capcha"
            :sitekey="siteKey"
            @verify="data.captcha = $event"
            @expired="data.captcha = ''"
          />
        </div>
      </div>
      
        
      
        <div class="form__item"> 
          <div class="form__submit">
            <button
              class="btn"
              :disabled="submitting">
              <span>
                {{ t('form.createAccount') }}
              </span>
            </button>
          </div>
        </div>

    </form>
  </div>
</template>

<style lang="scss" scoped>
.popUp{
  background: rgba(0, 0, 0, 0.60);
	backdrop-filter: blur(em(5));
	position: fixed;
	top: 0;
	width: 100dvw;
	height: 100%;
	z-index: 10;
	display: none;

  &.active {
		@include flex(false, center, center, false);
	}
}

.form__lang {
  margin-left: auto;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  width: 100%;
}
.row {
  width: 100%;
  &--top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
  &:empty {
    display: none;
  }
}
.socIcon {
  width: 24px;
  height: 24px;
}
.personIcon {
  width: 16px;
  height: 16px;
  color: #1976d2;
}
.header {
  height: 40px;
  background: #e7ebf0ff;
  color: #000000dd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.01em;
  span {
    margin-left: 10px;
  }
}
.terms {
  display: flex;
  & > span * {
    color: #999999;
    font-size: 10px;
    line-height: 140%;
  }
}
.termsCheckbox {
  margin-right: 16px;
}

.captcha {
  display: block;
  // display: flex;
  // justify-content: center;
}
.submit {
  height: 40px;
  width: 100%;
  font-weight: bold;
  font-size: 14px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: 0;
  border: 0;
  margin: 0;
  cursor: pointer;
  vertical-align: middle;
  text-decoration: none;
  min-width: 64px;
  padding: 6px 16px;
  border-radius: 4px;
  color: rgb(255, 255, 255);
  background-color: rgb(25, 118, 210);
  box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px -2px,
    rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px;

  &:disabled {
    color: rgba(0, 0, 0, 0.26);
    box-shadow: none;
    background-color: rgba(0, 0, 0, 0.12);
  }
}
</style> -->
