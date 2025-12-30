<script setup>
import { Play } from 'lucide-vue-next'
</script>

<template>
    <div class="card bg-base-100 image-full shadow-sm h-32">
        <figure class="h-full">
            <img src="https://img.freepik.com/free-psd/music-design-template_23-2150776075.jpg?t=st=1767087176~exp=1767090776~hmac=739542ae2b5e30b07a153f5fa17cb9b432591cf15661f331307134133a1bdd0e" alt="Cover"
                class="object-cover w-full h-full" />
        </figure>

        <div class="card-body p-2 justify-end">
            <h2 class="card-title text-xs leading-none">
                Playlist
            </h2>

            <p class="text-[10px] opacity-70 leading-tight line-clamp-2">
                A card component has a figure, a body part, and inside body there are title and actions parts
            </p>

            <div class="card-actions justify-end">
                <button class="btn btn-primary btn-xs px-2 min-h-0 h-5 flex items-center gap-1">
                    <Play class="w-3 h-3" />
                    <span>Play</span>
                </button>
            </div>
        </div>
    </div>
</template>
