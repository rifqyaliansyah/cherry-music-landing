const RECENT_SEARCHES_KEY = 'recentSearches'
const MAX_RECENT_SEARCHES = 10

export const getRecentSearches = () => {
    if (typeof window === 'undefined') return []

    try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error('Error loading recent searches:', error)
        return []
    }
}

export const saveRecentSearch = (query) => {
    if (typeof window === 'undefined') return
    if (!query || query.trim() === '') return

    try {
        const searches = getRecentSearches()

        // Remove duplicate if exists
        const filtered = searches.filter(item => item.query !== query)

        // Add new search at the beginning
        const updated = [
            {
                query,
                timestamp: Date.now()
            },
            ...filtered
        ].slice(0, MAX_RECENT_SEARCHES)

        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    } catch (error) {
        console.error('Error saving recent search:', error)
    }
}

export const clearRecentSearches = () => {
    if (typeof window === 'undefined') return

    try {
        localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch (error) {
        console.error('Error clearing recent searches:', error)
    }
}

export const removeRecentSearch = (query) => {
    if (typeof window === 'undefined') return

    try {
        const searches = getRecentSearches()
        const filtered = searches.filter(item => item.query !== query)
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered))
    } catch (error) {
        console.error('Error removing recent search:', error)
    }
}