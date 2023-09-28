<template>
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="offcanvasRole"
    aria-labelledby="offcanvasRoleLabel"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" v-if="!confirmRemoval">{{ title }}</h5>
      <h5 class="offcanvas-title" v-if="confirmRemoval && form.id">Remove: {{ form.username }}</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body" v-if="formData">
      <!-- Confirm removal if confirmRemoval is true -->
      <div v-if="confirmRemoval">
        <p>Are you sure you want to delete this role?</p>
        <div class="d-grid mb-3">
          <button type="button" class="btn btn-danger" @click.prevent="removeConfirmed" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRole">Confirm deletion</button>
        </div>
        <div class="d-grid mb-3">
          <button type="button" class="btn btn-secondary" @click.prevent="removeUnconfirmed">Cancel</button>
        </div>
      </div>
      <form @submit.prevent="save" v-if="!confirmRemoval">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="username-input"
            placeholder="Username"
            v-model="form.username"
            autocomplete="off"
            :class="{'is-valid': formValidation.username.valid === true, 'is-invalid': formValidation.username.valid === false}"
          />
          <label for="username-input">Username</label>
          <div class="invalid-feedback" :class="{'d-none': formValidation.username.valid !== false}">{{ formValidation.username.message }}</div>
        </div>

        <!-- <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" role="switch" id="is-administrator" v-model="form.administrator">
          <label class="form-check-label" for="is-administrator">
            Administrator
          </label>
        </div> -->
        
        <div class="form-floating mb-3">
          <textarea
            class="form-control"
            id="role-zones"
            placeholder="Zones"
            v-model="form.zones"
            :class="{'is-valid': formValidation.zones.valid === true, 'is-invalid': formValidation.zones.valid === false}"
          ></textarea>
          <label for="role-zones">Zones</label>
          <small class="text-muted">One zone per line</small>
          <div class="invalid-feedback" :class="{'d-none': formValidation.zones.valid !== false}">{{ formValidation.zones.message }}</div>
        </div>

        <div class="d-grid mb-3">
          <button type="submit" class="btn btn-primary" :disabled="!isValid || !changed" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRole">Save</button>
        </div>
        <div class="d-grid mb-3" v-if="form.id">
          <button type="button" class="btn btn-danger" @click.prevent="remove">Delete</button>
        </div>
        <div class="d-grid mb-3">
          <button type="button" class="btn btn-secondary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRole">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DnsRecordForm',
  props: ['formData'],
  data() {
    return {
      title: '',
      form: {
        zones: null,
        administrator: false,
        username: null,
      },
      formValidation: {
        zones: {
          valid: null,
          message: 'Zones are required'
        },
        username: {
          valid: null,
          message: 'Username is required'
        },
      },
      changed: false,
      confirmRemoval: false,
    }
  },
  mounted() {
    try {
      this.$el.removeEventListener('shown.bs.offcanvas', () => {})
      this.$el.removeEventListener('hidden.bs.offcanvas', () => {})
    } catch (e) {
      console.log(e.message)
    }
    
    this.$el.addEventListener('shown.bs.offcanvas', () => {
      this.loadFormData({...this.formData})
      this.resetValidation()
    })
    this.$el.addEventListener('hidden.bs.offcanvas', () => {
      this.title = '...'
      this.resetValidation()
    })
  },
  watch: {
    formData: function(val) {
      this.form = {...val}
      this.title = this.form.id ? `Edit: ${this.form.username}` : 'Add role'
    },
    form: {
      handler: function (val) {
        this.formValidation.zones.valid = null
        this.formValidation.username.valid = null

        if ((!!val.id && val.username === '') || (!val.id && val.username === '')) {
          this.formValidation.username.valid = false
        } else if (this.changed) {
          this.formValidation.username.valid = true
        }

        if ((!!val.id && val.zones === '') || (!val.id && val.zones === '')) {
          this.formValidation.zones.valid = false
        } else if (this.changed) {
          this.formValidation.zones.valid = true
        }

        this.changed = true
      },
      deep: true
    }
  },
  computed: {
    isValid() {
      let valid = true

      try {
        for (let key in this.formValidation) {
          if (this.formValidation[key].valid === false) {
            valid = false
            break
          }
        }
      } catch (e) {
        console.log(e.message)
      }

      return valid
    }
  },
  methods: {
    resetValidation() {
      this.changed = false
      this.confirmRemoval = false
      for (let key in this.formValidation) {
        this.formValidation[key].valid = null
      }
    },
    loadFormData(value) {
      this.form = {...value}
      this.title = this.form.id ? `Edit: ${this.form.username}` : 'Add role'
    },
    save() {
      if (this.isValid) {
        this.$emit('save', {...this.form})
      }
    },
    remove() {
      this.confirmRemoval = true
    },
    removeConfirmed() {
      this.$emit('remove', {...this.form})
    },
    removeUnconfirmed() {
      this.confirmRemoval = false
    },
  }
}
</script>