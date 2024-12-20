<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    video: String,
    radius: Boolean,
    poster: String
})

const player = ref(null)

onMounted(() => {
    function onEntry(entry) {
        entry.forEach(change => {
            if(change.isIntersecting) {
                play.value = false
                videoPlayer()
                player.value.autoplay = true
                player.value.play() 
            } else {
                play.value = true
                videoPlayer()
            }
        })
    }

    let options = { threshold: [0.5] }
    let observer = new IntersectionObserver(onEntry, options)
    observer.observe(player.value)
})

const play = ref(false),
    load = ref(false)
    
const videoPlayer = () => {
    const videoItem = player.value
    videoItem.volume = 0.1
    play.value = !play.value
    if(play.value){
        // videoItem.muted = false
        // videoItem.autoplay = true
        videoItem.play() 
    } else{
        videoItem.pause()
        // videoItem.autoplay = false
        // videoItem.muted = true
    }
}

const restart = () => {
    play.value = false
    videoPlayer()
}

// const loadFunc = () => {
//     if(player.value.readyState >= 3) load.value = true
// }
</script>

<template>
    <div 
        class="video" 
        :class="{ active: play, radius: radius, load: load }"
    >
        <video @loadeddata="loadFunc" ref="player" :src="`video/${props.video}.mp4`" :poster="props.poster" @ended="restart" autoplay loop muted playsinline type='video/mp4'>
            <!-- <source :src="`video/${props.video}.mp4`" loop type="video/mp4"> -->
        </video>

        <img class="video__preloadImg" :src="props.poster" alt="prize">
    </div>
</template>

<style lang="scss">
.video {
    width: 100%;
    @include flex(false, center, center, false);
    position: relative;
    transition: all .35s ease-in-out;
    overflow: hidden;

    &::after {
        transition: all .35s ease-in-out;
        content: '';
        width: 100%;
        height: 100%;
        background: rgba(20, 18, 82, 0.24);
        backdrop-filter: blur(em(4));
        position: absolute;
        clip-path: inset(0 0 0 0);
    }

    &::before {
        transition: all .35s ease-in-out;
        content: '';
        background-image: url(../../assets/img/sections/uGames/Play.svg);
        background-size: em(64) em(64);
        position: absolute;
        width: em(64);
        height: em(64);
        z-index: 1;
    }

    &.active {
        &::after,
        &::before {
            opacity: 0;
            clip-path: inset(50% 50% 50% 50%);
        }
    }

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: em(24);
        border: em(1) solid #FFFFFF3D;
        z-index: 1;
    }

    &.radius{
        video {
            border-radius: unset;
            border: none;
        }

        &::after {
            background: transparent;
            backdrop-filter: blur(0);
        }
    }

    &__preloadImg{
        position: absolute;
        top: 0;
        left: 0;
    }

    &.load{
        .video__preloadImg{
            display: none;
        }
    }
}
</style>