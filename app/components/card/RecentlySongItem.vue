<script setup>
import { Play } from 'lucide-vue-next'
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
        <!-- COVER -->
        <div class="relative w-12 h-12 shrink-0">
            <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="cover"
                class="w-full h-full rounded object-cover" />

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
                Lihat Dengar Rasakan
            </p>
            <p class="text-sm opacity-70 truncate">
                Sheila On 7
            </p>
        </div>

        <!-- DURATION -->
        <div class="w-12 text-sm opacity-70 text-right">
            3:55
        </div>
    </div>
</template>
