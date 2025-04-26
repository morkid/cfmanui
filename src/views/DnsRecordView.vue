<template>
  <div>
    <div class="alert alert-warning alert-dismissible" role="alert" v-if="error !== ''">
      {{ error }}
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click.prevent="hideAlert"
      ></button>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h4 class="d-flex justify-content-between mb-4">
          <RouterLink class="text-muted" :to="{ name: 'zones' }" style="text-decoration: none"
            >&laquo; {{ zone.name ?? '...' }}</RouterLink>
          <button class="btn btn-danger" :disabled="processing" data-bs-toggle="modal" data-bs-target="#modalPurgeCache">Purge Cache</button>
        </h4>
      </div>
      <div class="col-lg-10 col-md-8 col-sm-12 mb-4">
        <SearchInput @search="doSearch" :disabled="processing" placeholder="Search record" />
      </div>
      <div class="col-lg-2 col-md-4 col-sm-12 mb-4">
        <div class="d-grid">
          <button
            class="btn btn-primary"
            type="button"
            id="button-search"
            @click="add"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDnsRecord"
            :disabled="processing"
          >
            + Add record
          </button>
        </div>
      </div>
    </div>
    <div class="card" v-if="processing">
      <div class="card-body text-center py-5">
        <strong>Loading ...</strong>
      </div>
    </div>
    <DnsRecordTable
      :dnsRecords="dnsRecords"
      :pagination="pagination"
      @edit="onEdit"
      @page="setPage"
      v-if="!processing"
    />
    <DnsRecordForm :formData="formData" @save="onSave" @remove="onRemove" />
    <ZonePurgeCacheModal :zoneName="zone?.name" @purge="doPurgeCache" />
  </div>
</template>

<script setup>
import SearchInput from '@/components/SearchInput.vue'
import DnsRecordTable from '@/components/DnsRecordTable.vue'
import DnsRecordForm from '@/components/DnsRecordForm.vue'
import ZonePurgeCacheModal from '../components/ZonePurgeCacheModal.vue'
</script>

<script>
import Api from '@/lib/api'

export default {
  data() {
    return {
      dnsRecords: [],
      pagination: {},
      formData: {},
      search: '',
      error: '',
      zonePath: `/client/v4/zones/${this.$route.params.id}`,
      basePath: `/client/v4/zones/${this.$route.params.id}/dns_records`,
      page: 1,
      perPage: 50,
      zone: {},
      processing: false
    }
  },
  mounted() {
    this.api = new Api(this.$router)
    this.api.get(`${this.zonePath}`).then((response) => {
      this.zone = { ...response.data.result }
      document.title = `${import.meta.env.VITE_APP_NAME} | ${this.zone.name}`
    })
    this.getDnsRecords()
  },
  methods: {
    async getDnsRecords() {
      this.processing = true
      this.dnsRecords = []
      this.error = ''
      try {
        let queryString = `?order=type&direction=asc&per_page=${this.perPage}&page=${this.page}`
        if (this.search && this.search.length > 0) {
          queryString += `&name.contains=${encodeURIComponent(this.search)}`
          queryString += `&content.contains=${encodeURIComponent(this.search)}`
          queryString += `&type.contains=${encodeURIComponent(this.search)}`
          queryString += `&comment.contains=${encodeURIComponent(this.search)}`
          queryString += '&match=any'
        }
        var response = await this.api.get(`${this.basePath}${queryString}`)
        this.dnsRecords = [...response.data.result]
        this.pagination = { ...response.data.result_info }
      } catch (e) {
        this.error = this.api.getError(e, 'cannot get dns records')
      }
      this.processing = false
    },
    hideAlert() {
      this.error = ''
    },
    doSearch(value) {
      this.search = value
      this.getDnsRecords()
    },
    onEdit(dnsRecord) {
      this.formData = { ...dnsRecord }
    },
    add() {
      this.formData = {
        name: '',
        type: 'A',
        content: '',
        proxied: true,
        ttl: 1,
        comment: ''
      }
    },
    onSave(dnsRecord) {
      if (dnsRecord.id) {
        this.update(dnsRecord)
      } else {
        this.create(dnsRecord)
      }
    },
    update(dnsRecord) {
      this.processing = true
      this.api.patch(`${this.basePath}/${dnsRecord.id}`, { ...dnsRecord })
        .then(() => {
          this.getDnsRecords()
        })
        .catch((e) => {
          this.processing = false
          this.error = this.api.getError(e, 'Failed to update dns record')
        })
    },
    create(dnsRecord) {
      this.processing = true
      this.api.post(`${this.basePath}`, dnsRecord)
        .then(() => {
          this.getDnsRecords()
        })
        .catch((e) => {
          this.processing = false
          this.error = this.api.getError(e, 'Failed to create dns record')
        })
    },
    onRemove(dnsRecord) {
      this.processing = true
      this.api.delete(`${this.basePath}/${dnsRecord.id}`)
        .then(() => {
          this.getDnsRecords()
        })
        .catch((e) => {
          this.processing = false
          this.error = this.api.getError(e, 'Failed to delete dns record')
        })
    },
    doPurgeCache() {
      this.processing = true
      this.api.post(`${this.zonePath}/purge_cache`, {
        purge_everything: true
      }).then(() => {
        this.processing = false
      }).catch(e => {
        this.processing = false
        this.error = this.api.getError(e, 'Failed to purge cache')
      })
    },
    setPage(pageNumber) {
      this.page = pageNumber
      this.pagination.page = pageNumber
      this.getDnsRecords()
    }
  }
}
</script>
