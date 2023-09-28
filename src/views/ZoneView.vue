<template>
  <div>
    <div class="row mb-4">
      <div class="col-lg-6 col-md-8 col-sm-12">
        <SearchInput @search="doSearch" placeholder="Search zone" :disabled="processing"/>
      </div>
    </div>
    <div class="alert alert-warning alert-dismissible" v-if="error !== ''">
      {{ error }}
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click.prevent="hideAlert"
      ></button>
    </div>
    <div class="row">
      <div class="col-lg-3 col-md-4 col-sm-12" v-for="z in zones" :key="z.name">
        <RouterLink class="card mb-3" :to="{ name: 'dns_records', params: { id: z.id } }" style="text-decoration: none;">
          <div class="card-body">
            <p>{{ z.name }}</p>
            <small class="text-muted">{{ z.account?.name }}</small>
          </div>
        </RouterLink>
      </div>
    </div>
    <nav aria-label="Page navigation" v-if="totalPages > 1">
      <ul class="pagination">
        <li class="page-item"><a class="page-link" :class="{disabled: page == 1}" href="#" @click.prevent="prevPage">&lsaquo;</a></li>
        <li class="page-item"><a class="page-link" :class="{disabled: page == totalPages}" href="#" @click.prevent="nextPage">&rsaquo;</a></li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import SearchInput from '@/components/SearchInput.vue'
</script>

<script>
import Api from '@/lib/api'
export default {
  name: 'ZoneView',
  data() {
    return {
      zones: [],
      error: '',
      search: '',
      processing: false,
      page: 1,
      pagination: {},
    }
  },
  mounted() {
    this.api = new Api(this.$router)
    this.getZones()
    document.title = `${import.meta.env.VITE_APP_NAME} | Zones`
  },
  computed: {
    totalPages() {
      let totalPages = 0

      try {
        let mod = this.pagination.total_count % this.pagination.per_page
        totalPages = (this.pagination.total_count - mod) / this.pagination.per_page
        if (mod > 0) {
          totalPages += 1
        }
        if (isNaN(totalPages)) {
          totalPages = 0
        }
      } catch(e) {
        console.log(e.message)
      }

      return totalPages
    }
  },
  methods: {
    async getZones() {
      this.error = ''
      this.zones = []
      this.processing = true
      try {
        var queryString = `?per_page=50&page=${this.page}`
        if (this.search != '' && this.search.length > 0) {
          queryString += `&name=${encodeURIComponent('contains:'+this.search)}`
        }
        var response = await this.api.get(`/client/v4/zones${queryString}`)
        this.zones = [...response.data.result]
        this.pagination = {...response.data.result_info}
      } catch (e) {
        this.error = 'cannot get zones'
      } finally {
        this.processing = false
      }
    },
    nextPage() {
      if (this.page >= this.totalPages) {
        this.page = this.totalPages
      }

      this.getZones()
    },
    prevPage() {
      if (this.page < 1) {
        this.page = 1
      }

      this.getZones()
    },
    doSearch(value) {
      this.search = value
      this.getZones()
    },
    hideAlert() {
      this.error = ''
    },
  }
}
</script>