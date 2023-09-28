<template>
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="offcanvasDnsRecord"
    aria-labelledby="offcanvasDnsRecordLabel"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" v-if="!confirmRemoval">{{ title }}</h5>
      <h5 class="offcanvas-title" v-if="confirmRemoval && form.id">Remove: {{ form.full_name }}</h5>
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
        <p>Are you sure you want to delete this record?</p>
        <div class="d-grid mb-3">
          <button type="button" class="btn btn-danger" @click.prevent="removeConfirmed" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDnsRecord">Confirm deletion</button>
        </div>
        <div class="d-grid mb-3">
          <button type="button" class="btn btn-secondary" @click.prevent="removeUnconfirmed">Cancel</button>
        </div>
      </div>
      <form @submit.prevent="save" v-if="!confirmRemoval">
        <div class="form-floating mb-3">
          <select
            class="form-control"
            :class="{'is-valid': formValidation.type.valid === true, 'is-invalid': formValidation.type.valid === false}"
            id="record-type-select"
            placeholder="Type"
            v-model="form.type"
          >
            <option value="">Select type</option>
            <option value="A">A</option>
            <option value="AAAA">AAAA</option>
            <option value="CNAME">CNAME</option>
            <option value="TXT">TXT</option>
            <option value="MX">MX</option>
          </select>
          <label for="record-type-select">Type</label>
          <div class="invalid-feedback" :class="{'d-none': formValidation.type.valid !== false}">{{ formValidation.type.message }}</div>
        </div>
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="record-name-input"
            placeholder="Record name"
            v-model="form.name"
            :class="{'is-valid': formValidation.name.valid === true, 'is-invalid': formValidation.name.valid === false}"
          />
          <label for="record-name-input">Name</label>
          <div class="invalid-feedback" :class="{'d-none': formValidation.name.valid !== false}">{{ formValidation.name.message }}</div>
        </div>
        <div class="form-floating mb-3" v-if="['MX'].indexOf(form.type) >= 0">
          <input
            type="number"
            class="form-control"
            min="1"
            step="1"
            max="65535"
            id="record-priority-input"
            placeholder="Priority"
            v-model="form.priority"
          />
          <label for="record-priority-input">Priority</label>
        </div>
        <div class="form-floating mb-3">
          <textarea
            class="form-control"
            id="record-content-input"
            placeholder="Content"
            v-model="form.content"
            :class="{'is-valid': formValidation.content.valid === true, 'is-invalid': formValidation.content.valid === false}"
          ></textarea>
          <label for="record-content-input">Content</label>
          <div class="invalid-feedback" :class="{'d-none': formValidation.content.valid !== false}">{{ formValidation.content.message }}</div>
        </div>
        <div class="form-floating mb-3">
          <select
            class="form-control"
            id="record-ttl-select"
            placeholder="TTL"
            v-model="form.ttl"
            :class="{'is-valid': isValid}"
            :disabled="autoTTL"
          >
            <option value="1">Auto</option>
            <option value="60">1 min</option>
            <option value="120">2 min</option>
            <option value="300">5 min</option>
            <option value="600">10 min</option>
            <option value="900">15 min</option>
            <option value="1800">30 min</option>
            <option value="3600">1 hr</option>
            <option value="7200">2 hr</option>
            <option value="18000">5 hr</option>
            <option value="43200">12 hr</option>
            <option value="14400">1 day</option>
          </select>
          <label for="record-ttl-select">TTL</label>
        </div>
        <div class="form-check form-switch mb-3" v-if="['CNAME', 'A', 'AAAA'].indexOf(form.type) >= 0">
          <input class="form-check-input" type="checkbox" role="switch" id="record-proxied" v-model="form.proxied">
          <label class="form-check-label" for="record-proxied">
            <IconRecordDnsProxied class="w-32p d-inline mx-2" v-if="form.proxied" />
            <IconRecordDnsOnly class="w-32p h-20p d-inline mx-2" v-if="!form.proxied" />
            {{ form.proxied ? 'Proxied' : 'DNS Only' }}
          </label>
        </div>
        <div class="form-floating mb-3">
          <textarea
            class="form-control"
            id="record-comment-input"
            placeholder="Comment"
            maxlength="100"
            v-model="form.comment"
          ></textarea>
          <label for="record-comment-input">Comment</label>
        </div>
        <div class="d-grid mb-3">
          <button type="submit" class="btn btn-primary" :disabled="!isValid || !changed" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDnsRecord">Save</button>
        </div>
        <div class="d-grid mb-3" v-if="form.id">
          <button type="button" class="btn btn-danger" @click.prevent="remove">Delete</button>
        </div>
        <div class="d-grid mb-3">
          <button type="button" class="btn btn-secondary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDnsRecord">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import IconRecordDnsOnly from '@/components/icons/IconRecordDnsOnly.vue'
import IconRecordDnsProxied from '@/components/icons/IconRecordDnsProxied.vue'
</script>

<script>
export default {
  name: 'DnsRecordForm',
  props: ['formData'],
  data() {
    return {
      title: 'Add new record',
      form: {
        type: '',
        name: '',
        content: '',
        proxied: false,
        comment: '',
        priority: 10,
      },
      formValidation: {
        type: {
          valid: null,
          message: 'Type is required'
        },
        name: {
          valid: null,
          message: 'Name is required'
        },
        content: {
          valid: null,
          message: 'Content is required'
        },
        ttl: {},
        proxied: {},
        comment: {
          valid: null,
          message: 'Comment is required'
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
      this.form = {...this.formData}
      this.title = this.form.id ? `Edit: ${this.form.full_name}` : 'Add new record'
      this.resetValidation()
    })
    this.$el.addEventListener('hidden.bs.offcanvas', () => {
      this.title = '...'
      this.resetValidation()
    })
  },
  watch: {
    form: {
      handler: function (val) {
        this.formValidation.type.valid = true
        this.formValidation.name.valid = null
        this.formValidation.content.valid = null
        if (val.type === '') {
          this.formValidation.type.valid = false
        } else if (this.changed) {
          this.formValidation.type.valid = true
        }

        if ((!!val.id && val.name === '') || (!val.id && val.name === '')) {
          this.formValidation.name.valid = false
        } else if (this.changed) {
          this.formValidation.name.valid = true
        }

        if ((!!val.id && val.content === '') || (!val.id && val.content === '')) {
          this.formValidation.content.valid = false
        } else if (this.changed) {
          this.formValidation.content.valid = true
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
    },
    autoTTL() {
      let auto = false

      if (this.form.proxied) {
        auto = true
        this.form.ttl = 1
      }

      return auto
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
    save() {
      if (this.isValid) {
        let form = {...this.form}
        form.full_name = undefined

        if (['CNAME', 'A', 'AAAA'].indexOf(this.form.type) < 0) {
          form.proxied = undefined
        }

        this.$emit('save', {...form})
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