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
    <AuditTable :logs="logs" :pagination="pagination" @gotoPage="gotoPage" v-if="error === '' && !processing"/>
  </div>
</template>

<script setup>
import AuditTable from '../components/AuditTable.vue'
</script>

<script>
import Api from '@/lib/api'

export default {
  data() {
    return {
      logs: [],
      api: null,
      pagination: {},
      page: 1,
      error: '',
      processing: false,
    }
  },
  mounted() {
    document.title = `${import.meta.env.VITE_APP_NAME} | Audit Logs`
    this.api = new Api(this.$router)
    this.getAuditLogs()
  },
  methods: {
    getAuditLogs() {
      this.processing = true
      this.api.get(`/audits?page=${this.page - 1}`)
        .then((response) => {
          this.logs = [...response.data.items]
          const { page, size, total_pages, first, max_page } = response.data
          this.pagination = {
            page: page + 1,
            size,
            total_pages,
            first,
            last: total_pages === page + 1,
            max_page: max_page,
          }
        })
        .catch((e) => {
          this.error = this.api.getError(e, 'cannot get audit logs')
        }).finally(() => {
          this.processing = false
        })
    },
    gotoPage(page) {
      this.page = page
      this.getAuditLogs()
    },
    hideAlert() {
      this.error = ''
    }
  },
}
</script>