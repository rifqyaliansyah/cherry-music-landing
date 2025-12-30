<script setup>
import { Play } from 'lucide-vue-next'

const props = defineProps({
    track: {
        type: Object,
        default: () => ({
            title: 'Song Title',
            user: { username: 'Artist Name' },
            artwork_url: null
        })
    },
    duration: {
        type: String,
        default: '0:00'
    },
    index: {
        type: Number,
        default: 0
    }
})

const defaultCover = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTza-HTN5aM1ulD7TESCkcoSzB4FyCeppspOQ&s'
const coverUrl = computed(() => {
    if (props.track.artwork_url) {
        // Replace 'large' with 't500x500' for better quality
        return props.track.artwork_url.replace('large', 't500x500')
    }
    return defaultCover
})
</script>

<template>
    <div class="
        group
        flex items-center gap-4
        px-4 py-3
        rounded-lg
        hover:bg-base-200
        transition
        cursor-pointer
    ">
        <!-- INDEX NUMBER -->
        <div class="w-8 text-sm opacity-50 group-hover:opacity-100 transition">
            {{ index }}
        </div>

        <!-- COVER -->
        <div class="relative w-12 h-12 shrink-0">
            <img :src="coverUrl" :alt="track.title" class="w-full h-full rounded object-cover"
                @error="(e) => e.target.src = defaultCover" />

            <!-- DARK OVERLAY -->
            <div class="
                absolute inset-0
                bg-black/50
                opacity-0
                group-hover:opacity-100
                transition
                rounded
            "></div>

            <!-- PLAY ICON -->
            <div class="
                absolute inset-0
                flex items-center justify-center
                opacity-0
                group-hover:opacity-100
                transition
            ">
                <Play class="w-6 h-6 text-white" />
            </div>
        </div>

        <!-- TITLE + ARTIST -->
        <div class="min-w-0 flex-1">
            <p class="font-medium truncate">
                {{ track.title }}
            </p>
            <p class="text-sm opacity-70 truncate">
                {{ track.user?.username || 'Unknown Artist' }}
            </p>
        </div>

        <!-- DURATION -->
        <div class="w-12 text-sm opacity-70 text-right">
            {{ duration }}
        </div>
    </div>
</template>