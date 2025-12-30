<script setup>
import SearchSongItem from '~/components/card/SearchSongItem.vue'
import { X } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const { debouncedSearch } = useSearchMusic()

const loadingMore = ref(false)
const limit = ref(20)
const observer = ref(null)
const loadMoreTrigger = ref(null)
const isInitialLoad = ref(true)

// Load recent searches on mount
onMounted(() => {
    searchStore.loadRecentSearches()

    // If there's a query in URL, search immediately
    const urlQuery = route.query.q
    if (urlQuery) {
        searchStore.setQuery(urlQuery)
        limit.value = 20
        isInitialLoad.value = true
        debouncedSearch(urlQuery, limit.value)
    } else {
        // Clear results if no query in URL
        searchStore.clearResults()
    }
})

// Clear results when leaving the page
onBeforeUnmount(() => {
    searchStore.clearResults()
    if (observer.value) {
        observer.value.disconnect()
        observer.value = null
    }
})

// Watch for URL query changes
watch(() => route.query.q, (newQuery) => {
    if (newQuery) {
        // Disconnect observer saat query baru
        if (observer.value) {
            observer.value.disconnect()
            observer.value = null
        }

        searchStore.setQuery(newQuery)
        limit.value = 20
        isInitialLoad.value = true
        debouncedSearch(newQuery, limit.value)
    } else {
        searchStore.clearResults()
    }
})

const handleLoadMore = async () => {
    // Prevent multiple simultaneous loads
    if (loadingMore.value || !hasMoreResults.value || isInitialLoad.value) return

    loadingMore.value = true

    // Disconnect observer temporarily
    if (observer.value) {
        observer.value.disconnect()
    }

    limit.value += 20

    try {
        await debouncedSearch(searchStore.query, limit.value)
    } finally {
        loadingMore.value = false

        // Reconnect observer after load complete
        nextTick(() => {
            setupInfiniteScroll()
        })
    }
}

const hasMoreResults = computed(() => {
    return searchStore.results.length < searchStore.totalResults
})

const setupInfiniteScroll = () => {
    if (!loadMoreTrigger.value) return

    // Disconnect existing observer if any
    if (observer.value) {
        observer.value.disconnect()
    }

    observer.value = new IntersectionObserver(
        (entries) => {
            const entry = entries[0]

            // Only trigger if not initial load and conditions are met
            if (entry.isIntersecting && !isInitialLoad.value && hasMoreResults.value && !loadingMore.value) {
                handleLoadMore()
            }
        },
        {
            root: null,
            rootMargin: '200px', // Increased margin for better UX
            threshold: 0
        }
    )

    observer.value.observe(loadMoreTrigger.value)
}

// Watch for results and setup observer
watch(() => searchStore.results.length, (newLength, oldLength) => {
    if (newLength > 0) {
        // Mark initial load as complete after first results
        if (isInitialLoad.value && newLength === 20) {
            isInitialLoad.value = false
        }

        // Only setup observer if length changed (new data loaded)
        if (newLength !== oldLength) {
            nextTick(() => {
                setupInfiniteScroll()
            })
        }
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
        <div v-if="searchStore.loading && isInitialLoad" class="flex flex-col gap-1">
            <div v-for="n in 5" :key="n" class="flex items-center gap-4 px-4 py-3">
                <div class="skeleton w-8 shrink-0"></div>
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

            <!-- Table Header -->
            <div class="flex items-center gap-4 px-4 py-2 mb-1">
                <div class="w-8 text-sm font-semibold opacity-70">#</div>
                <div class="w-12 shrink-0 text-sm font-semibold opacity-70">Title</div>
                <div class="flex-1"></div>
                <div class="w-12 text-sm font-semibold opacity-70 text-right">Duration</div>
            </div>
            <div class="border-b border-base-300 mb-2"></div>

            <!-- Results List -->
            <div class="flex flex-col gap-1">
                <SearchSongItem v-for="(track, index) in searchStore.results" :key="`${track.id}-${index}`"
                    :track="track" :index="index + 1" :duration="formatDuration(track.duration)" />
            </div>

            <!-- Infinite Scroll Trigger -->
            <div ref="loadMoreTrigger" class="h-20 flex items-center justify-center">
                <span v-if="loadingMore && hasMoreResults" class="loading loading-spinner loading-md"></span>
                <span v-else-if="!hasMoreResults" class="text-sm opacity-50">No more results</span>
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