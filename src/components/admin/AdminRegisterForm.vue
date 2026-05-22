<template>
  <div class="admin-leads">
    <h3 class="mb-4">Khách Hàng Đăng Ký (Leads)</h3>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <div v-else class="card p-3 bg-light border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle bg-white">
          <thead class="table-dark">
            <tr>
              <th>Ngày ĐK</th>
              <th>Khách hàng</th>
              <th>Số ĐT</th>
              <th>Quan tâm</th>
              <th>Lời nhắn</th>
              <th>Trạng thái</th>
              <th class="text-center">Xóa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in leads" :key="lead.id" :class="{'table-success': lead.status === 'Thành công', 'table-warning': lead.status === 'Mới'}">
              <td class="text-muted small">{{ formatDate(lead.created_at) }}</td>
              <td class="fw-bold">{{ lead.name }}</td>
              <td>
                <a :href="'tel:' + lead.phone" class="text-decoration-none fw-bold text-primary">{{ lead.phone }}</a>
              </td>
              <td><span class="badge bg-secondary">{{ lead.course_interest }}</span></td>
              <td style="max-width: 200px; white-space: normal;">{{ lead.message || '-' }}</td>
              <td>
                <select v-model="lead.status" @change="updateStatus(lead.id, lead.status)" class="form-select form-select-sm" :class="getStatusColor(lead.status)">
                  <option value="Mới">Mới</option>
                  <option value="Đã tư vấn">Đã tư vấn</option>
                  <option value="Thành công">Thành công</option>
                  <option value="Hủy">Hủy</option>
                </select>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" @click="deleteLead(lead.id)">
                  <i class="bi bi-trash"></i> Xóa
                </button>
              </td>
            </tr>
            <tr v-if="leads.length === 0">
              <td colspan="7" class="text-center py-4 text-muted">Chưa có khách đăng ký nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabase.js'

export default {
  name: 'AdminLeads',
  data() {
    return {
      leads: [],
      loading: true,
    }
  },
  async mounted() {
    await this.fetchLeads()
  },
  methods: {
    async fetchLeads() {
      this.loading = true
      const { data, error } = await supabase
        .from('registerForm')
        .select('*')
        .order('created_at', { ascending: false }) // Khách mới nhất lên đầu

      if (error) {
        console.error('Lỗi tải data khách:', error.message)
      } else {
        this.leads = data || []
      }
      this.loading = false
    },
    async updateStatus(id, newStatus) {
      try {
        const { error } = await supabase
          .from('registerForm')
          .update({ status: newStatus })
          .eq('id', id)
        
        if (error) throw error
      } catch (error) {
        console.error('Lỗi cập nhật:', error.message)
        alert('Cập nhật trạng thái thất bại!')
      }
    },
    async deleteLead(id) {
      if (!confirm('Xóa thông tin khách hàng này?')) return
      try {
        const { error } = await supabase.from('registerForm').delete().eq('id', id)
        if (error) throw error
        this.leads = this.leads.filter(l => l.id !== id)
      } catch (error) {
        alert('Lỗi xóa khách hàng!')
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
    },
    getStatusColor(status) {
      if (status === 'Mới') return 'text-danger fw-bold'
      if (status === 'Thành công') return 'text-success fw-bold'
      if (status === 'Đã tư vấn') return 'text-primary'
      return 'text-muted'
    }
  }
}
</script>

<style scoped>
/* Chống vỡ bảng */
.admin-leads table {
  table-layout: fixed;
  width: 100%;
}
.admin-leads td {
  word-wrap: break-word;
  white-space: normal !important;
}
.admin-leads th:nth-child(1) { width: 15%; } /* Ngày */
.admin-leads th:nth-child(2) { width: 18%; } /* Tên */
.admin-leads th:nth-child(3) { width: 15%; } /* ĐT */
.admin-leads th:nth-child(4) { width: 17%; } /* Quan tâm */
.admin-leads th:nth-child(5) { width: 15%; } /* Message */
.admin-leads th:nth-child(6) { width: 12%; } /* Status */
.admin-leads th:nth-child(7) { width: 8%; }  /* Xóa */
</style>