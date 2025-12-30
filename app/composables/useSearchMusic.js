export const useSearchMusic = () => {
    const config = useRuntimeConfig()
    const searchStore = useSearchStore()

    const searchMusic = async (query, limit = 20, offset = 0) => {
        if (!query || query.trim() === '') {
            searchStore.clearResults()
            return
        }

        searchStore.setLoading(true)
        searchStore.setError(null)

        try {
            const response = await $fetch('/api/v1/search', {
                baseURL: config.public.apiBase,
                method: 'GET',
                params: {
                    q: query.trim(),
                    limit,
                    offset,
                    type: 'tracks'
                }
            })

            if (response.success) {
                searchStore.setResults(response.data)
                searchStore.addRecentSearch(query.trim())
                return response.data
            } else {
                throw new Error(response.message || 'Search failed')
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to search music'
            searchStore.setError(errorMessage)
            console.error('Search error:', error)
            throw error
        } finally {
            searchStore.setLoading(false)
        }
    }

    const debouncedSearch = useDebounceFn((query, limit) => {
        return searchMusic(query, limit)
    }, 400)

    return {
        searchMusic,
        debouncedSearch
    }
}