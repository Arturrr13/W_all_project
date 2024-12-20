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
import { computed, onMounted, reactive, ref, unref } from 'vue';
import { VueRecaptcha } from 'vue-recaptcha';
import { useToast } from 'vue-toastification';
import FieldCheckbox from '@/components/FieldCheckbox.vue';
import FieldInput from '@/components/FieldInput.vue';
import SectionPlate from '@/components/SectionPlate.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import {
  createDomainLinkSafe,
  getApiConfiguration,
  redirectToTDS,
  registrationProcess,
} from '@/lib';
import { useTranslation } from '@/composition/useTranslation';
import ChooseLanguage from '@/components/ChooseLanguage.vue';

const toast = useToast();
const { t } = useTranslation('common');

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

const terms = ref(false);

const data = reactive({
  email: '',
  password: '',
  captcha: '',
});

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
  }
};
</script>

<template>
  <SectionPlate>
    <form
      class="form"
      autocomplete="off"
      novalidate
      @submit="onSubmit"
    >
      <div class="row row--top">
        <a
          v-if="googleSignInLink"
          :href="googleSignInLink"
          class="socLink"
        >
          <SvgIcon
            class="socIcon"
            name="google"
          />
        </a>
        <a
          v-if="facebookSignInLink"
          :href="facebookSignInLink"
          class="socLink"
        >
          <SvgIcon
            class="socIcon"
            name="facebook"
          />
        </a>
        <a
          v-if="appleSignInLink"
          :href="appleSignInLink"
          class="socLink"
        >
          <SvgIcon
            class="socIcon"
            name="apple"
          />
        </a>
        <div class="chooseLang">
          <ChooseLanguage />
        </div>
      </div>
      <div class="row">
        <div class="header">
          <SvgIcon
            class="personIcon"
            name="person"
          />
          <span>{{ t('form.registration') }}</span>
        </div>
      </div>
      <div class="row">
        <FieldInput
          name="email"
          icon="email"
          type="email"
          :placeholder="t('form.email') || ''"
          v-model="data.email"
          :error="unref(v$.email?.$errors[0]?.$message)"
          @blur="v$.email?.$touch!"
        />
      </div>
      <div class="row">
        <FieldInput
          name="password"
          icon="lock"
          type="password"
          :placeholder="t('form.password') || ''"
          v-model="data.password"
          :error="unref(v$.password?.$errors[0]?.$message)"
          @blur="v$.password?.$touch!"
        />
      </div>
      <div
        v-if="apiConfiguration"
        class="row"
      >
        <VueRecaptcha
          ref="recaptchaRef"
          class="captcha"
          :sitekey="apiConfiguration.captchaSiteKey"
          @verify="data.captcha = $event"
          @expired="data.captcha = ''"
        />
      </div>
      <div class="row">
        <div class="terms">
          <FieldCheckbox
            class="termsCheckbox"
            v-model="terms"
            :invalid="v$.terms.$dirty && v$.terms.$invalid"
            @blur="v$.terms?.$touch!"
          />
          <span>
            <span
              >{{ t('form.iAgreeWith') }}
              <a :href="termsLink">{{ t('form.termsAndConditions') }}</a></span
            >
          </span>
        </div>
      </div>
      <div class="row">
        <button
          class="submit"
          :disabled="submitting"
        >
          {{ t('form.createAccount') }}
        </button>
      </div>
    </form>
  </SectionPlate>
</template>

<style lang="scss" scoped>
.chooseLang {
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
.socLink {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 12px;
  border: 1px solid #e2e2e2;
  box-shadow: 0 1px 0 #e2e2e2;
  border-radius: 8px;
  &:hover {
    background-color: whitesmoke;
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
  display: flex;
  justify-content: center;
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
</style>
