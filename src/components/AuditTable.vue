<template>
  <div>
    <div class="card mb-3" v-if="logs && logs.length > 0">
      <div class="card-body p-0">
        <table class="table m-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Zone</th>
              <th>Record</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td>{{ formatDate(log.created_at) }}</td>
              <td>{{ log.store_value?.record?.zone_name }}</td>
              <td>{{ log.store_value?.record?.name }}</td>
              <td>{{ mapAction(log.store_value?.action) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="d-flex justify-content-lg-end justify-content-center" v-if="pagination && pagination.total_pages > 1">
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{disabled: isFirst()}" v-if="pagination.total_pages >= 5"><a class="page-link" href="#" @click.prevent="gotoPage(1)">&laquo;</a></li>
          <li class="page-item" :class="{disabled: isFirst()}"><a class="page-link" href="#" @click.prevent="gotoPrevPage">&lsaquo;</a></li>
          <li class="page-item" :class="{disabled: p.disabled || p.page < 1}" v-for="p in getPaginations()" :key="p.page"><a class="page-link" href="#" @click.prevent="gotoPage(p.page)">{{p.page ? p.page : '...'}}</a></li>
          <li class="page-item" :class="{disabled: isLast()}"><a class="page-link" href="#" @click.prevent="gotoNextPage">&rsaquo;</a></li>
          <li class="page-item" :class="{disabled: isLast()}" v-if="pagination.total_pages >= 5"><a class="page-link" href="#" @click.prevent="gotoPage(totalPages)">&raquo;</a></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: ['logs', 'pagination'],
  methods: {
    formatDate(raw) {
      let formatted = raw

      try {
        formatted = moment(raw).format('YYYY-MM-DD HH:mm:ssZ')        
      } catch (e) {
        console.log(e.message)
      }

      return formatted
    },
    isFirst() {
      return this.pagination.first
    },
    isLast() {
      return this.pagination.last
    },
    gotoPrevPage() {
      this.gotoPage(this.pagination.page - 1)
    },
    gotoNextPage() {
      this.gotoPage(this.pagination.page + 1)
    },
    gotoPage(page) {
      this.$emit('gotoPage', page)
    },
    getPaginations() {
      let paginations = []

      try {
        let totalPages = this.pagination.total_pages
        if (totalPages < 5) {
          for (let i = 1; i <= totalPages; i++) {
            paginations.push({
              page: i,
              disabled: i === this.pagination.page,
            })
          }
        } else {
          let start = this.pagination.page - 1
          let next = this.pagination.page+1

          if (next > totalPages) {
            next = totalPages
            start = totalPages - 2
          }

          if (start < 1) {
            start = 1
            next = totalPages
            if (totalPages > 3) {
              next = 3
            }
          } else if (start > totalPages) {
            start = totalPages
          }

          for (let i = start; i <= next; i++) {
            paginations.push({
              page: i,
              disabled: i === this.pagination.page,
            })
          }
        }
      } catch (e) {
        console.log(e.message)
      }

      return paginations
    },
    mapAction(act) {
      switch (act) {
      case 'PATCH':
      case 'PUT':
        return 'Update'
      case 'POST':
        return 'Create'
      case 'DELETE':
        return 'Delete'
      default:
        return 'Unknown'
      }
    }
  }
}
</script>