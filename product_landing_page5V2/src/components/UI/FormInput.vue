<script setup>
import { ref } from 'vue'

const props = defineProps({
    type: String
})

const emit = defineEmits(['emailValid', 'passwordValid'])

const error = ref(false)
const value = ref()
const showPs = ref(false)
const pasErrText = ref('Min 8 symbols')

const checkInput = () => {
    const err = (status) => status ? error.value = true : error.value = false

    const checkEmail = () => {
        if(value.value.length > 0 && Boolean(value.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) !== false) {
            err(false)
            emit('emailValid', true)
        } else {
            err(true)
            emit('emailValid', false)
        }
    }

    const checkPassword = () => {
        const hasCapital = s => !(s === s.toLowerCase())
        if(value.value.length >= 8 && value.value.length <= 40 && hasCapital(value.value) && /[0-9]/.test(value.value)){
            err(false)
            emit('passwordValid', true)
        } else {
            if(value.value.length < 8) pasErrText.value = 'Min 8 symbols'
            else if(value.value.length > 40) pasErrText.value = 'Max 40 symbols'
            else if(!/[0-9]/.test(value.value)) pasErrText.value = 'Password must contain a number'
            else pasErrText.value = 'Password must contain a capital letter'
            err(true)
            emit('passwordValid', false)
        }
    }

    props.type === 'email' ? checkEmail() : checkPassword()
}
</script>

<template>
    <div class="input">
        <div class="input__label" :class="{ error: error }">
            <span v-if="props.type === 'email'">
                Email *
            </span>
            <span v-else>
                Password *
            </span>
        </div>

        <div class="input__wrapper" v-if="props" :class="{ error: error }">
            <div class="input__wrapper--leftIcon">
                <svg v-if="props.type === 'email'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <mask id="mask0_883_1929" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_883_1929)">
                    <path d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM12 12.825C12.0833 12.825 12.1708 12.8125 12.2625 12.7875C12.3542 12.7625 12.4417 12.725 12.525 12.675L19.6 8.25C19.7333 8.16667 19.8333 8.0625 19.9 7.9375C19.9667 7.8125 20 7.675 20 7.525C20 7.19167 19.8583 6.94167 19.575 6.775C19.2917 6.60833 19 6.61667 18.7 6.8L12 11L5.3 6.8C5 6.61667 4.70833 6.6125 4.425 6.7875C4.14167 6.9625 4 7.20833 4 7.525C4 7.69167 4.03333 7.8375 4.1 7.9625C4.16667 8.0875 4.26667 8.18333 4.4 8.25L11.475 12.675C11.5583 12.725 11.6458 12.7625 11.7375 12.7875C11.8292 12.8125 11.9167 12.825 12 12.825Z" fill="white" fill-opacity="0.6"/>
                    </g>
                </svg>
                <svg v-else  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <mask id="mask0_883_1940" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_883_1940)">
                    <path d="M6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V10C4 9.45 4.19583 8.97917 4.5875 8.5875C4.97917 8.19583 5.45 8 6 8H7V6C7 4.61667 7.4875 3.4375 8.4625 2.4625C9.4375 1.4875 10.6167 1 12 1C13.3833 1 14.5625 1.4875 15.5375 2.4625C16.5125 3.4375 17 4.61667 17 6V8H18C18.55 8 19.0208 8.19583 19.4125 8.5875C19.8042 8.97917 20 9.45 20 10V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM12 17C12.55 17 13.0208 16.8042 13.4125 16.4125C13.8042 16.0208 14 15.55 14 15C14 14.45 13.8042 13.9792 13.4125 13.5875C13.0208 13.1958 12.55 13 12 13C11.45 13 10.9792 13.1958 10.5875 13.5875C10.1958 13.9792 10 14.45 10 15C10 15.55 10.1958 16.0208 10.5875 16.4125C10.9792 16.8042 11.45 17 12 17ZM9 8H15V6C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6V8Z" fill="white" fill-opacity="0.6"/>
                    </g>
                </svg>
            </div>
    
            <input 
                :type="showPs ? showPs : props.type"
                v-model="value"
                @input="checkInput"
                :placeholder="`Enter your ${props.type}`"
            >
    
            <div class="input__wrapper--errorText">
                <span v-if="props.type === 'email'">
                    Provide a valid e-mail address
                </span>
                <span v-else>
                    {{ pasErrText }}
                </span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.input{
    &__label{
        padding-bottom: em(10);
        &.error{
            color: #ff3333;
        }
    }
}

.input__wrapper{
    position: relative;
    @include flex(false, center, false, false);
    &--leftIcon, &--rightIcon{
        position: absolute;
        transform: translateY(em(2));
        svg{
            width: em(24);
            height: em(24);
        }
    }

    &--leftIcon{
        padding-right: em(14);
        left: em(14);
    }

    &--errorText{
        opacity: 0;
        position: absolute;
        bottom: em(-5);
        right: em(15);
        background: #ff3333;
        border-radius: em(10);
        padding: em(2) em(10);
        @include text(#fff, .90em, 400, .90em);
    }

    &.error{
        input[type=password],
        input[type=email],
        input[type=text]{
            border: em(2) solid #ff3333;
        }

        .input__wrapper--leftIcon{
            svg path{
                fill: #ff3333;
            }
        }

        .input__wrapper--errorText{
            opacity: 1;
        }
    }
}

input[type=password],
input[type=email],
input[type=text]{
    padding: em(12) em(12) em(12) em(45);
    border: em(1) solid #ffffff90;
    border-radius: em(12);
    background: transparent;
    font-size: em(18);
    line-height: 125%;
    color: #ffffff;
    width: 100%;
    &:focus{
        border: em(1) solid #ffffff;
    }
}
</style>