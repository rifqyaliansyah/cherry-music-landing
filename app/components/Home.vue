<script setup>
import MusicCard from '~/components/card/MusicCard.vue'
import RecentlySongItem from '~/components/card/RecentlySongItem.vue'
</script>

<template>
    <div>
        <div>
            <h1 class="text-2xl font-semibold mb-4">Recently Listen Albums</h1>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MusicCard v-for="n in 8" :key="n" />
            </div>
        </div>

        <div class="mt-8">
            <h1 class="text-2xl font-semibold mb-4">Recently Listen Music</h1>
            <div class="flex flex-col gap-1">
                <RecentlySongItem v-for="n in 5" :key="n" />
            </div>
        </div>
    </div>
</template>