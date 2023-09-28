<template>
  <div class="container">
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title text-center">CFMan</h4>
            </div>
            <div class="card-body">
              <h5 class="text-muted">{{ processing ? 'Checking browser status...' : 'Please sign in to access the system' }}</h5>
              <div class="d-grid" v-if="signin.authorize_url && !processing">
                <a :href="signin.authorize_url" class="btn btn-success my-2">Sign in with <strong>{{ signin.app_name }}</strong></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/lib/api'

export default {
  data() {
    return {
      api: null,
      signin: {},
      processing: false,
    }
  },
  mounted() {
    this.api = new Api(this.$router)
    this.initialize()
    document.title = `${import.meta.env.VITE_APP_NAME} | Login`
  },
  methods: {
    initialize() {
      this.processing = true
      this.api.get('/oauth2/logout').catch(() => {}).finally(() => {
        this.api.get('/oauth2/login').then(res => {
          this.signin = {...res.data}
          localStorage.setItem('logged_in', 'true')
        }).catch(() => {}).finally(() => {
          this.processing = false
        })
      })
    }
  }
}
</script>