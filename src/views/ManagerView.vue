<script setup>
import NavigationBar from '../components/NavigationBar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div>
    <NavigationBar />
    <div class="container mt-5 pt-5">
      <RouterView />
    </div>
  </div>
</template>

<script>
import Api from '@/lib/api'
import { useUserinfoStore } from '@/stores/userinfo'

export default {
  data() {
    return {
      api: null
    }
  },
  mounted() {
    this.api = new Api(this.$router)
    this.getUserinfo()
  },
  methods: {
    getUserinfo() {
      this.api.get('/oauth2/userinfo').then((res) => {
        const store = useUserinfoStore()
        const { setUserinfo } = store
        setUserinfo({ ...res.data })
        this.api
          .get(`/roles/${encodeURIComponent(store.username)}`)
          .then((role) => {
            setUserinfo({ ...res.data, role: role.data })
          })
          .catch((e) => {
            console.log(e.message)
          })
      })
    }
  }
}
</script>
