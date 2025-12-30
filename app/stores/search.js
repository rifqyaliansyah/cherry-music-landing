import { defineStore } from 'pinia'
import { getRecentSearches, saveRecentSearch, clearRecentSearches } from '~/utils/localStorage'

export const useSearchStore = defineStore('search', {
    state: () => ({
        query: '',
        results: [],
        recentSearches: [],
        loading: false,
        error: null,
        totalResults: 0,
        hasSearched: false
    }),

    getters: {
        hasResults: (state) => state.results.length > 0,
        isEmpty: (state) => state.hasSearched && state.results.length === 0,
        hasRecentSearches: (state) => state.recentSearches.length > 0
    },

    actions: {
        setQuery(query) {
            this.query = query
        },

        setResults(data) {
            this.results = data.collection || []
            this.totalResults = data.total_results || 0
            this.hasSearched = true
        },

        setLoading(status) {
            this.loading = status
        },

        setError(error) {
            this.error = error
        },

        clearResults() {
            this.results = []
            this.totalResults = 0
            this.hasSearched = false
            this.error = null
        },

        loadRecentSearches() {
            this.recentSearches = getRecentSearches()
        },

        addRecentSearch(query) {
            if (!query || query.trim() === '') return

            const trimmedQuery = query.trim()
            saveRecentSearch(trimmedQuery)
            this.loadRecentSearches()
        },

        removeRecentSearch(query) {
            const searches = getRecentSearches()
            const filtered = searches.filter(item => item.query !== query)
            localStorage.setItem('recentSearches', JSON.stringify(filtered))
            this.loadRecentSearches()
        },

        clearAllRecentSearches() {
            clearRecentSearches()
            this.loadRecentSearches()
        },

        reset() {
            this.query = ''
            this.results = []
            this.loading = false
            this.error = null
            this.totalResults = 0
            this.hasSearched = false
        }
    }
})