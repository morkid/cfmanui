<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <nav class="navbar navbar-expand-lg border-bottom fixed-top bg-dark">
    <div class="container">
      <a class="navbar-brand" href="#">CFMan</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#main-navbar"
        aria-controls="main-navbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="main-navbar">
        <ul class="navbar-nav me-auto my-2 my-lg-0">
          <li class="nav-item">
            <RouterLink 
              class="nav-link" 
              :class="{active: ['zones', 'dns_records'].indexOf($route.name) >= 0}" 
              aria-current="page" 
              :to="{ name: 'zones' }">
              Zones
            </RouterLink>
          </li>
          <li class="nav-item" v-if="userinfo?.role?.is_admin">
            <RouterLink 
              class="nav-link" 
              :class="{active: $route.name === 'roles'}" 
              aria-current="page" 
              :to="{ name: 'roles' }">
              Roles
            </RouterLink>
          </li>
          <li class="nav-item" v-if="userinfo?.role?.is_admin">
            <RouterLink 
              class="nav-link" 
              :class="{active: $route.name === 'audits'}" 
              aria-current="page" 
              :to="{ name: 'audits' }">
              Audit Log
            </RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto my-2 my-lg-0">
          <li class="nav-item">
            <div class="form-check form-switch mt-2 me-2">
              <input
                class="form-check-input"
                v-model="darkMode"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                checked
              />
              <label class="form-check-label" for="flexSwitchCheckDefault">Dark mode</label>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                :src="avatar"
                class="rounded-circle object-fit-contain h-24p d-inline-block"
                alt="avatar"
              />
              {{ displayname }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><RouterLink class="dropdown-item" :to="{ name: 'zones' }">Zones</RouterLink></li>
              <li v-if="loggedIn">
                <RouterLink class="dropdown-item" :to="{ name: 'login' }">Sign out</RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useUserinfoStore } from '@/stores/userinfo'
import { storeToRefs } from 'pinia'
import logo from '@/assets/logo.svg'

export default {
  name: 'NavigationBar',
  data() {
    const store = storeToRefs(useUserinfoStore())
    return {
      darkMode: null,
      userinfo: store.userinfo,
      displayname: store.displayname,
      roles: [],
    }
  },
  mounted() {
    this.darkMode = localStorage.getItem('darkMode') !== 'disabled'
  },
  computed: {
    avatar() {
      let avatar = logo

      if (this.userinfo) {
        let avatarFields = [
          'avatar',
          'image',
          'picture',
          'profile_picture',
        ]

        let localConfig = localStorage.getItem('avatar_field')
        if (localConfig) {
          avatarFields.unshift(localConfig)
        }

        for (let i in avatarFields) {
          let image = this.userinfo[avatarFields[i]]
          if (image && image !== '') {
            avatar = image
            break
          }
        }
      }

      return avatar
    },
    loggedIn() {
      return localStorage.getItem('logged_in') === 'true'
    }
  },
  watch: {
    darkMode: function (val) {
      if (val) {
        this.$el.classList.add('bg-dark')
        this.$el.classList.remove('bg-light')
        document.body.setAttribute('data-bs-theme', 'dark')
        localStorage.setItem('darkMode', 'enabled')
      } else {
        this.$el.classList.add('bg-light')
        this.$el.classList.remove('bg-dark')
        document.body.removeAttribute('data-bs-theme')
        localStorage.setItem('darkMode', 'disabled')
      }
    }
  }
}
</script>
