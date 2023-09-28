<template>
  <div>
    <div class="card mb-3" v-if="dnsRecords && dnsRecords.length > 0">
      <div class="card-body p-0">
        <table class="table m-0">
          <thead class="table-light">
            <tr>
              <th class="d-md-table-cell d-lg-none">DNS Records</th>
              <th class="d-none d-lg-table-cell">Type</th>
              <th class="d-none d-lg-table-cell">Name</th>
              <th class="d-none d-lg-table-cell" style="width: 40%">Content</th>
              <th class="d-none d-lg-table-cell">Proxy Status</th>
              <th class="d-none d-lg-table-cell">TTL</th>
              <th class="d-none d-lg-table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dns in dnsRecords" :key="dns.id">
              <td class="d-md-table-cell d-lg-none p-0">
                <!-- inline table -->
                  <table class="table table-striped table-borderless table-sm p-0 mb-5">
                    <tbody>
                      <tr>
                        <td class="text-end" style="width: 30%;">Type</td><td>: {{ dns.type }}</td>
                      </tr>
                      <tr>
                        <td class="text-end">Name</td><td class="align-top text-break text-wrap">:&nbsp;{{ getPrefixName(dns) }}</td>
                      </tr>
                      <tr>
                        <td class="text-end">Content</td><td class="align-top text-break text-wrap">:&nbsp;{{ dns.content }}</td>
                      </tr>
                      <tr>
                        <td class="text-end">
                          Proxy Status
                        </td>
                        <td>:
                          <IconRecordDnsProxied class="w-32p d-inline mx-2" v-if="dns.proxied && ['CNAME','A','AAAA'].indexOf(dns.type) >= 0" />
                          <IconRecordDnsOnly class="w-32p h-20p d-inline mx-2" v-if="!dns.proxied && ['CNAME','A','AAAA'].indexOf(dns.type) >= 0" />
                          {{ dns.proxied ? 'Proxied' : 'DNS Only' }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-end">TTL</td><td>: {{ dns.ttl === 1 ? 'Auto' : dns.ttl }}</td>
                      </tr>
                      <tr>
                        <td class="text-end">
                          Actions
                        </td>
                        <td>: 
                          <a 
                            class="btn btn-sm btn-primary"
                            data-bs-toggle="offcanvas" 
                            href="#offcanvasDnsRecord" 
                            @click="setForm(dns)" 
                            role="button" 
                            aria-controls="offcanvasDnsRecord">
                            Edit
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                <!-- end inline table -->
              </td>
              <td class="d-none d-lg-table-cell">{{ dns.type }}</td>
              <td class="d-none d-lg-table-cell">{{ getPrefixName(dns) }}</td>
              <td class="d-none d-lg-table-cell text-break text-wrap">
                {{ dns.content }}
                <div class="badge bg-info float-end" v-if="dns.priority >= 0">
                  {{ dns.priority }}
                </div>
              </td>
              <td class="d-none d-lg-table-cell text-nowrap">
                <IconRecordDnsProxied class="w-32p d-inline mx-2" v-if="dns.proxied && ['CNAME','A','AAAA'].indexOf(dns.type) >= 0" />
                <IconRecordDnsOnly class="w-32p h-20p d-inline mx-2" v-if="!dns.proxied && ['CNAME','A','AAAA'].indexOf(dns.type) >= 0" />
                {{ dns.proxied ? 'Proxied' : 'DNS Only' }}
              </td>
              <td class="d-none d-lg-table-cell">{{ dns.ttl === 1 ? 'Auto' : dns.ttl }}</td>
              <td class="d-none d-lg-table-cell">
                <a 
                  data-bs-toggle="offcanvas" 
                  href="#offcanvasDnsRecord" 
                  @click="setForm(dns)" 
                  role="button" 
                  aria-controls="offcanvasDnsRecord">
                  Edit
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="d-flex justify-content-lg-end justify-content-center" v-if="pagination && totalPages > 1">
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{disabled: isFirst()}" v-if="totalPages >= 5"><a class="page-link" href="#" @click.prevent="gotoPage(1)">&laquo;</a></li>
          <li class="page-item" :class="{disabled: isFirst()}"><a class="page-link" href="#" @click.prevent="gotoPrevPage">&lsaquo;</a></li>
          <li class="page-item" :class="{disabled: p.disabled || p.page < 1}" v-for="p in getPaginations()" :key="p.page"><a class="page-link" href="#" @click.prevent="gotoPage(p.page)">{{p.page ? p.page : '...'}}</a></li>
          <li class="page-item" :class="{disabled: isLast()}"><a class="page-link" href="#" @click.prevent="gotoNextPage">&rsaquo;</a></li>
          <li class="page-item" :class="{disabled: isLast()}" v-if="totalPages >= 5"><a class="page-link" href="#" @click.prevent="gotoPage(totalPages)">&raquo;</a></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import IconRecordDnsOnly from '@/components/icons/IconRecordDnsOnly.vue'
import IconRecordDnsProxied from '@/components/icons/IconRecordDnsProxied.vue'
</script>

<script>
export default {
  props: ['dnsRecords', 'pagination'],
  data() {
    return {}
  },
  mounted() {
    
  },
  watch: {
    pagination: {
      handler: function () {
        this.getPaginations()
      },
      deep: true
    }
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
    getPrefixName(dnsRecord) {
      let escapePattern = dnsRecord.zone_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      let regex = new RegExp(`(\\.${escapePattern})$`)
      return dnsRecord.name.replace(regex, '')
    },
    setForm(dns) {
      let dnsRecord = {...dns}
      dnsRecord.full_name = dnsRecord.name
      dnsRecord.name = this.getPrefixName(dns)
      this.$emit('edit', dnsRecord)
    },
    isFirst() {
      let first = false

      try {
        first = this.pagination.page === 1
      } catch (e) {
        console.log(e.message)
      }

      return first
    },
    isLast() {
      let last = false

      try {
        let totalPrevious = this.pagination.per_page * this.pagination.page
        let reached = this.pagination.total_count - totalPrevious < 1
        last = reached
      } catch (e) {
        console.log(e.message)
      }

      return last
    },
    gotoPrevPage() {
      try {
        let prevPage = this.pagination.page - 1
        if (prevPage < 1) {
          prevPage = 1
        }
        this.$emit('page', prevPage)
      } catch (e) {
        console.log(e.message)
      }
    },
    gotoNextPage() {
      try {
        this.$emit('page', this.pagination.page + 1)
      } catch (e) {
        console.log(e.message)
      }
    },
    gotoPage(page) {
      try {
        this.$emit('page', page)
      } catch (e) {
        console.log(e.message)
      }
    },
    getPaginations() {
      let paginations = []

      try {
        let totalPages = this.totalPages
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
    }
  }
}
</script>