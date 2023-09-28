import axios from 'axios'

export default class Api {
  constructor(router) {
    this.baseURL = import.meta.env.VITE_API_BASE_URL
    this.axios = axios.create({
      baseURL: this.baseURL,
    })
    this.$router = router

    this.axios.interceptors.request.use(config => {
      let accessToken = localStorage.getItem('access_token')
      let masterToken = import.meta.env.VITE_API_AUTH_TOKEN
      if (!accessToken && masterToken && masterToken !== '') {
        accessToken = masterToken
      }

      if (accessToken && !config.headers.get('authorization')) {
        config.headers.set('authorization', ['Bearer', accessToken].join(' '))
      }

      return config
    }, e => Promise.reject(e))

    this.axios.interceptors.response.use(response => {
      return response
    }, e => {
      if (e.response && [401].indexOf(e.response.status) >= 0) {
        if (this.$router.currentRoute.value.path !== '/login') {
          this.$router.replace('/login')
        }
      }
      return Promise.reject(e)
    })
  }

  get(path, headers) {
    return this.axios.get(path, headers)
  }

  put(path, data, headers) {
    return this.axios.put(path, data, headers)
  }

  patch(path, data, headers) {
    return this.axios.patch(path, data, headers)
  }

  post(path, data, headers) {
    return this.axios.post(path, data, headers)
  }

  delete(path, headers) {
    return this.axios.delete(path, headers)
  }

  getError(err, defaultMessage = 'Something went wrong.') {
    let errorMessage = ''

    try {
      if (err.response) {
        errorMessage = err.response.data.errors[0].message
      } else if (err.request) {
        errorMessage = 'The request was made but no response was received'
      } else {
        errorMessage = err.message
      }
    } catch(e) {
      errorMessage = defaultMessage
    }

    return errorMessage
  }
}