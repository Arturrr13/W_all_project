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
const recaptchaRef = ref<VueRecaptcha | null>(null);
const submitting = ref(false);

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
    // captcha: {
    //   required,
    // },
  })),
  computed(() => ({
    ...data,
    terms: terms.value,
  }))
);

const onSubmit = async (e: Event) => {
  e.preventDefault();
  const formIsValid = await v$.value.$validate();
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

	//emit('formSuccess');
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
		<div class="popUp__body">
			<div class="popUp__body--title">
				<p class="congrat">
					{{ t('banner.congrat') }}
				</p>
				<p class="uWon">
					{{ t('banner.uWon') }}
				</p>
			</div>

			<div class="popUp__body--prize">
				<p class="bonus">
					300% {{ t('banner.bonus') }}!
				</p>
				<p class="fs">
					+ 200 {{ t('banner.fs') }}
				</p>
			</div>


			<form class="form" autocomplete="off" novalidate @submit="onSubmit">
				<div class="form__Elwrap">
					<FieldInput class="form__Elwrap--input" name="email" icon="email" type="email" :placeholder="'Email'" 
						v-model="data.email" :error="unref(v$.email?.$errors[0]?.$message)"
						@blur="v$.email?.$touch!" 
					/>
		
					<FieldInput class="form__Elwrap--input" name="password" icon="lock" type="password" :placeholder="'Password'"
						v-model="data.password" :error="unref(v$.password?.$errors[0]?.$message)"
						@blur="v$.password?.$touch!" 
					/>
		
					<div :ref="refs.set">
						<div class="form__item form__item_recaptcha" ref="recaptchaRef">
							<VueRecaptcha v-if="apiConfiguration" class="form__capcha"
								:sitekey="apiConfiguration.captchaSiteKey" @verify="data.captcha = $event"
								@expired="data.captcha = ''" />
						</div>
					</div>
		
					<div class="row">
						<div class="terms form__agreeBlock">
							<FieldCheckbox class="termsCheckbox" v-model="terms" :invalid="v$.terms.$dirty && v$.terms.$invalid" @blur="v$.terms?.$touch!" />
							<span class="form__agreeBlock--text">
								<span>By ticking this box to register for this website, the user declares to be over 18 years
									old and to have read, understood and accepted the
									<a :href="termsLink">
										Terms and Conditions.
									</a>
								</span>
							</span>
						</div>
					</div>
				</div>

				<button class="popUp__body--singUp" title="sing up" rel="nofollow" target="_blank" :disabled="submitting">
					<span>
						{{ t('banner.SignUp') }}
					</span>
				</button>
			</form>
		</div>

		<div class="popUp__cloud popUp__cloud--left">
			<img src="/img/cloudL.png" alt="cloud">
		</div>
		<div class="popUp__cloud popUp__cloud--right">
			<img src="/img/cloudR.png" alt="cloud">
		</div>
	</div>
</template>

<style lang="scss" scoped>
.captcha {
	display: flex;
	justify-content: center;
}

.popUp{
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%);
    backdrop-filter: blur(em(6));
    position: absolute;
    top: 0;
    left: 0;
    width: 101dvw;
    height: 101%;
    z-index: 10;
    display: none;
    animation: openPopUp .25s linear both;
    &.active{
        @include flex(false, center, center, false);
    }

    &.close{
        animation: closePopUp .25s linear both;
    }

	&__cloud{
		position: absolute;
		z-index: -1;

		&--left{
			width: em(1156);
			bottom: em(-30);
			left: em(-275);
		}

		&--right{
			width: em(1183);
			bottom: em(-100);
			right: em(-175);
		}
	}
}

.popUp__body{
    position: relative;
    padding: em(132) em(130) em(93) em(140);
    background: url(/img/BG/popUp.png) no-repeat;
    background-size: 100% 100%;
    @include flex(column, center, center, em(28));
    text-align: center;

    &--title{
        .congrat{
            @include text(#fff, em(40), 700, 1em);
        }
        .uWon{
            @include text(#fff, em(32), 400, 1em);
        }
    }

    &--prize{
        .bonus{
            @include text(#FFF743, em(66), 400, 1em);
        }
        .fs{
            @include text(#55FD52, em(48), 400, 1em);
        }

        .bonus, .fs{
            text-shadow: 0 em(2) em(5) rgba(0, 0, 0, 0.25);
		    font-family: "Titan One";
		    text-transform: uppercase;
        }
    }

    &--singUp{
		background-color: transparent;
        background-image: url(/img/BG/uWin.png);
	    background-repeat: no-repeat;
	    background-size: 100% 100%;
		font-size: 1em;
	    width: em(530);
	    height: em(106);
	    @include flex(false, center, center, false);
	    text-align: center;
        span{
            @include text(#fff, em(36), 400, 1em);
            font-family: "Titan One";
		    text-transform: uppercase;
            width: 100%;
            height: 100%;
            @include flex(false, center, center, false);
        }
    }
}

.form{
	@include flex(column, center, center, em(28));

	&__Elwrap{
		width: em(452);
		@include flex(column, center, center, em(16));

		&--input{
			width: 100%;
		}
	}

	&__agreeBlock{
        @include flex(false, flex-start, false, em(12));

        &--text{
            @include text(#fff, em(14), 400, 120%);
            text-align: start;
			a{
				@include text(#fff, 1em, 400, 120%);
			}
        }
    }
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
