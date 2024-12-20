<script setup>
import { computed, ref, watchEffect } from 'vue'

const props = defineProps({
    data: Object,
})

const activeCoeff = ref()
const bet = ref(25)
const win = computed(() => 
    Number.isInteger(bet.value * activeCoeff.value) ? 
    bet.value * activeCoeff.value :
    (bet.value * activeCoeff.value).toFixed(2)
)

const validAmount = (e) => {
    const f = x => x.toString().includes('.') ? x.toString().split('.').pop().length : 0
    const start = bet.value.slice(0, bet.value.indexOf(e.data)), end = bet.value.slice(bet.value.indexOf(e.data) + 1)
    if(/[^0-9 .]/g.test(bet.value)){
        bet.value = start + end
    } else {
        f(parseFloat(bet.value)) > 2  || parseFloat(bet.value) > 99999 ? bet.value = bet.value.slice(0, -1) : null
    }
}

watchEffect(async() => {
    if(props.data) activeCoeff.value = props.data.coeff.p1.value
})
</script>

<template>
    <div class="calculator__wrapper" v-if="props.data">
        <div class="coeff__wrapper">
            <div class="coeff__wrapper--item" 
                v-for="item in props.data.coeff" :key="item.name"
                :class="{ active: item.value == activeCoeff }"
                @click="activeCoeff = item.value"
            >
                <span class="type">
                    {{ item.name }}
                </span>
                <div class="border"></div>
                <span>
                    {{ item.value }}
                </span>
            </div>
        </div>

        <div class="bet__wrapper">
            <div class="title">
                <p class="title--mainStyle">
                    <span class="green">
                        Choose coefficient
                    </span>
                    and know your win!
                </p>
            </div>

            <div class="input__wrapper">
                <span class="input__wrapper--leftText">
                    Your bet
                </span>
                <input type="text" v-model="bet" @input="validAmount">
                <span class="input__wrapper--rightText">
                    €
                </span>
            </div>

            <div class="win__wrapper">
                <span>
                    {{ props.data.t2 }}
                    <span class="win__wrapper--amount">
                        {{ win }} €
                    </span>
                </span>
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.coeff__wrapper{
    @include flex(false, center, space-between, false);
    padding-bottom: em(24);
    &--item{
        transition: all .35s ease-in-out;
        width: em(146);
        padding: em(16);
        border-radius: em(12);
        border: em(1) solid rgba(255, 255, 255, 0.10);
        background: linear-gradient(90deg, rgba(12, 78, 229, 0.70) 50%, #0E56FB 50%);
        background-position: 192% top;
        background-size: 210% 100%;
        @include flex(false, center, space-between, false);
        
        .type{
            text-shadow: 0 em(4) em(4) rgba(0, 0, 0, 0.25);
            color: #fff;
        }

        span{
            @include text(#9AEF5B, 1.5em, 500, 130%);
        }

        .border{
            width: em(1);
            height: em(24);
            background: #fff;
            opacity: .25;
        }

        &.active{
            background-position: 98% top;
        }

        &:hover{
            cursor: pointer;
            background-position: 98% top;
        }
    }
}

.bet__wrapper{
    padding: em(20) em(35) em(30) em(35);
    border-radius: em(12);
    border: em(1) solid rgba(255, 255, 255, 0.10);
    background: rgba(12, 78, 229, 0.70);
    box-shadow: 0 em(20) em(40) 0 rgba(4, 17, 61, 0.70);
    backdrop-filter: blur(em(5));
    @include flex(column, false, false, em(20));
}

.title{
    &--mainStyle{
        @include text(#fff, 1.25em, 500, 130%);
    }
}

.input__wrapper{
    position: relative;
    @include flex(false, center, false, false);
    &--leftText, &--rightText{
        @include text(#535FE3, 1em, 400, 130%);
        position: absolute;
    }

    &--leftText{
        border-right: em(1) solid #ffffff50;
        padding-right: 0.875em;
        left: em(16);
    }

    &--rightText{
        right: em(16);
    }
}

input[type=text]{
    padding-left: em(90);
    &:focus{
        border: em(1) solid #535FE3;
    }
}

.win__wrapper{
    border-radius: em(6);
    border: em(1) solid rgba(255, 255, 255, 0.30);
    padding: em(10) 0;
    @include text(#fff, em(28), 500, 113%);
    text-align: center;
    &--amount{
        color: #9AEF5B;
    }
}
</style>