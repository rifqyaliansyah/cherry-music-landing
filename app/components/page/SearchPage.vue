<script setup>
import SearchSongItem from '~/components/card/SearchSongItem.vue'
import { X } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const { debouncedSearch } = useSearchMusic()

// Load recent searches on mount
onMounted(() => {
    searchStore.loadRecentSearches()

    // If there's a query in URL, search immediately
    const urlQuery = route.query.q
    if (urlQuery) {
        searchStore.setQuery(urlQuery)
        debouncedSearch(urlQuery, 20)
    } else {
        // Clear results if no query in URL
        searchStore.clearResults()
    }
})

// Clear results when leaving the page
onBeforeUnmount(() => {
    searchStore.clearResults()
})

// Watch for URL query changes
watch(() => route.query.q, (newQuery) => {
    if (newQuery) {
        searchStore.setQuery(newQuery)
        debouncedSearch(newQuery, 20)
    } else {
        searchStore.clearResults()
    }
})

const handleRecentClick = (query) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
}

const handleRemoveRecent = (query) => {
    searchStore.removeRecentSearch(query)
}

const handleClearAll = () => {
    searchStore.clearAllRecentSearches()
}

// Format duration from milliseconds to MM:SS
const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
</script>

<template>
    <div class="container mx-auto px-4 py-6">
        <!-- Loading State -->
        <div v-if="searchStore.loading" class="flex flex-col gap-1">
            <div v-for="n in 5" :key="n" class="flex items-center gap-4 px-4 py-3">
                <div class="skeleton w-12 h-12 rounded shrink-0"></div>
                <div class="flex-1 space-y-2">
                    <div class="skeleton h-4 w-3/4"></div>
                    <div class="skeleton h-3 w-1/2"></div>
                </div>
                <div class="skeleton h-3 w-12"></div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="searchStore.error" class="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ searchStore.error }}</span>
        </div>

        <!-- Search Results -->
        <div v-else-if="searchStore.hasResults">
            <div class="flex items-center justify-between mb-4">
                <h1 class="text-2xl font-semibold">
                    Search Results
                    <span class="text-sm font-normal opacity-70 ml-2">
                        ({{ searchStore.totalResults.toLocaleString() }} tracks found)
                    </span>
                </h1>
            </div>

            <div class="flex flex-col gap-1">
                <SearchSongItem v-for="track in searchStore.results" :key="track.id" :track="track"
                    :duration="formatDuration(track.duration)" />
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="searchStore.isEmpty" class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto opacity-30 mb-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-xl font-semibold mb-2">No results found</h2>
            <p class="opacity-70">Try different keywords</p>
        </div>

        <!-- Recently Search -->
        <div v-else-if="searchStore.hasRecentSearches">
            <div class="flex items-center justify-between mb-4">
                <h1 class="text-2xl font-semibold">Recently Search</h1>
                <button @click="handleClearAll" class="btn btn-ghost btn-sm">
                    Clear All
                </button>
            </div>

            <div class="flex flex-col gap-2">
                <div v-for="item in searchStore.recentSearches" :key="item.query"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-200 transition group">
                    <svg class="h-5 w-5 opacity-50 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8" stroke-width="2" />
                        <path d="M11 7v4l3 3" stroke-width="2" stroke-linecap="round" />
                    </svg>

                    <button @click="handleRecentClick(item.query)" class="flex-1 text-left hover:underline">
                        {{ item.query }}
                    </button>

                    <button @click="handleRemoveRecent(item.query)"
                        class="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition">
                        <X class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Initial State (No Recent Searches) -->
        <div v-else class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto opacity-30 mb-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 class="text-xl font-semibold mb-2">Start searching</h2>
            <p class="opacity-70">Find your favorite music</p>
        </div>
    </div>
</template>