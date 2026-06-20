// Base Urls
export const API_BASE_URL = 'https://em.fothubtv.com/api'
export const IMAGE_BASE_URL = 'https://em.fothubtv.com'

// export const API_BASE_URL = 'http://127.0.0.1:8000/api'
// export const IMAGE_BASE_URL = 'http://127.0.0.1:8000'

export const ENDPOINT = {
    // Authentication
    LOGIN : `${API_BASE_URL}/auth/login/`,
    TOKEN_REFRESH : `{API_BASE_URL}/auth/token/refresh/ `,

    // Categories
    CATEGORIES : {
        LIST : `{API_BASE_URL}/categories/`,
        CREATE : `{API_BASE_URL}/categories/create/ `,
        DETAIL : (uuid) => `{API_BASE_URL}/categories/${uuid}/`,
        UPDATE : (uuid) => `{API_BASE_URL}/categories/${uuid}/update/`,
        DELETE : (uuid) => `{API_BASE_URL}/categories/${uuid}/delete/`,
        BULK_DELETE : `{API_BASE_URL}/categories/bulk-delete/`,
    },

    // States
}