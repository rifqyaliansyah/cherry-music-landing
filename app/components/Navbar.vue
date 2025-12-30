<script setup>
const searchStore = useSearchStore()
const router = useRouter()
const route = useRoute()
const localQuery = ref('')

// Sync with URL query on mount and route change
watch(() => route.query.q, (newQuery) => {
    localQuery.value = newQuery || ''
}, { immediate: true })

const handleSearch = (e) => {
    const query = e.target.value
    localQuery.value = query

    if (query.trim()) {
        // Navigate to search page with query
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    } else {
        // If empty, go to search page without query (show recent searches)
        router.push('/search')
    }
}

const handleKeydown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        const query = e.target.value.trim()
        if (query) {
            router.push(`/search?q=${encodeURIComponent(query)}`)
        } else {
            router.push('/search')
        }
    }
}
</script>

<template>
    <nav class="navbar w-full bg-base-300">
        <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round"
                stroke-width="2" fill="none" stroke="currentColor" class="size-4">
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                <path d="M9 4v16" />
                <path d="M14 10l2 2l-2 2" />
            </svg>
        </label>

        <div class="px-4 flex items-center gap-2 font-semibold">
            <span class="text-sm sm:text-base whitespace-nowrap">
                Cherry Music
            </span>
        </div>

        <div class="ml-auto"></div>

        <label class="input input-bordered flex items-center gap-2">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </g>
            </svg>
            <input type="search" placeholder="Search Music" v-model="localQuery" @input="handleSearch"
                @keydown="handleKeydown" />
        </label>
    </nav>
</template>