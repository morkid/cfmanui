import { createRouter, createWebHashHistory } from 'vue-router'
import ZoneView from '../views/ZoneView.vue'
import DnsRecordView from '../views/DnsRecordView.vue'
import ManagerView from '../views/ManagerView.vue'
import LoginView from '../views/LoginView.vue'
import RoleManagementView from '../views/RoleManagementView.vue'
import AuditView from '../views/AuditView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'manager',
      component: ManagerView,
      children: [
        {
          path: '/',
          name: 'zones',
          component: ZoneView
        },
        {
          path: '/zones/:id/dns_records',
          name: 'dns_records',
          component: DnsRecordView
        },
        {
          path: '/roles',
          name: 'roles',
          component: RoleManagementView
        },
        {
          path: '/audits',
          name: 'audits',
          component: AuditView
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

export default router
