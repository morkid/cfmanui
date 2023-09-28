<template>
  <div class="row">
    <div class="col-md-12">
      <div class="alert alert-warning alert-dismissible" role="alert" v-if="error !== ''">
        {{ error }}
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click.prevent="hideAlert"
        ></button>
      </div>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
      <SearchInput placeholder="Search role" />
    </div>
    <div class="col-lg-8 col-md-6 col-sm-12 mb-4">
      <button
        class="btn btn-primary"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRole"
        @click.prevent="addRole"
      >
        + Add role
      </button>
    </div>
    <div class="col-sm-12">
      <table class="table">
        <thead class="table-light">
          <tr>
            <th>User</th>
            <th>Administrator</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.username">
            <td>{{ role.username }}</td>
            <td>{{ role.is_admin ? 'Yes' : 'No' }}</td>
            <td>{{ role.total_zones >= 0 ? `${role.total_zones} zones applied` : 'All zones' }}</td>
            <td>
              <a
                href="#"
                :class="{ disabled: role.total_zones < 0 }"
                :disabled="role.total_zones < 0"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRole"
                @click.prevent="editRole(role)"
                >Edit</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <RoleForm :formData="formData" @save="saveRole" @remove="removeRole" />
  </div>
</template>

<script setup>
import SearchInput from '@/components/SearchInput.vue'
import RoleForm from '@/components/RoleForm.vue'
</script>

<script>
import Api from '@/lib/api'

export default {
  data() {
    return {
      formData: {},
      roles: [],
      error: ''
    }
  },
  mounted() {
    this.api = new Api(this.$router)
    this.getRoles()
    document.title = `${import.meta.env.VITE_APP_NAME} | Roles`
  },
  methods: {
    getRoles() {
      this.api
        .get('/roles')
        .then((res) => {
          this.roles = [...res.data]
        })
        .catch((e) => {
          console.log(e.message)
        })
    },
    addRole() {
      this.formData = {
        username: '',
        zones: ''
      }
    },
    editRole(role) {
      this.api.get(`/roles/${encodeURIComponent(role.username)}`).then(res => {
        this.formData = {...res.data, id: 1}
      }).catch((e) => {
        this.addRole()
        this.error = this.api.getError(e, 'failed to load selected role')
      })
    },
    saveRole(role) {
      this.api
        .post(`/roles/${encodeURIComponent(role.username)}`, { ...role })
        .then(() => {
          this.getRoles()
        })
        .catch((e) => {
          this.error = this.api.getError(e, 'cannot load roles')
        })
    },
    removeRole(role) {
      this.api
        .delete(`/roles/${encodeURIComponent(role.username)}`)
        .then(() => {
          this.getRoles()
        })
        .catch((e) => {
          this.error = this.api.getError(e, 'cannot load roles')
        })
    },
    hideAlert() {
      this.error = ''
    },
  }
}
</script>
