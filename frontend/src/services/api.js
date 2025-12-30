import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

const api = axios.create({ baseURL })

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // simple global error handling
    const message = err.response?.data?.message || err.message
    return Promise.reject(new Error(message))
  }
)

export default api
