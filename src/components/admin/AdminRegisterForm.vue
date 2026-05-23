<template>
  <div class="admin-leads">
    <h3 class="mb-4 section-title">Học viên đăng ký</h3>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <div v-else class="card p-3 p-md-4 bg-light border-0 shadow-sm">
      <!-- ========== DESKTOP TABLE (md+) ========== -->
      <div class="table-responsive d-none d-md-block">
        <table class="table table-hover align-middle bg-white mb-0">
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
            <tr
              v-for="lead in leads"
              :key="lead.id"
              :class="{
                'table-success': lead.status === 'Thành công',
                'table-warning': lead.status === 'Mới',
              }"
            >
              <td class="text-muted small">{{ formatDate(lead.created_at) }}</td>
              <td class="fw-bold">{{ lead.name }}</td>
              <td>
                <a :href="'tel:' + lead.phone" class="text-decoration-none fw-bold text-primary">{{
                  lead.phone
                }}</a>
              </td>
              <td>
                <span class="badge bg-secondary">{{ lead.course_interest }}</span>
              </td>
              <td style="max-width: 200px; white-space: normal">{{ lead.message || '-' }}</td>
              <td>
                <select
                  v-model="lead.status"
                  @change="updateStatus(lead.id, lead.status)"
                  class="form-select form-select-sm"
                  :class="getStatusColor(lead.status)"
                >
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

      <!-- ========== MOBILE CARDS (< md) ========== -->
      <div class="d-md-none">
        <div v-if="leads.length === 0" class="text-center py-4 text-muted">
          Chưa có khách đăng ký nào.
        </div>
        <div
          v-for="lead in leads"
          :key="'m-' + lead.id"
          class="lead-card mb-3 p-3 bg-white rounded-3 shadow-sm border-start border-4"
          :class="getCardBorder(lead.status)"
        >
          <!-- Header: name + date -->
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 class="mb-0 fw-bold">{{ lead.name }}</h6>
              <a
                :href="'tel:' + lead.phone"
                class="text-decoration-none fw-bold text-primary small"
              >
                <i class="bi bi-telephone-fill me-1"></i>{{ lead.phone }}
              </a>
            </div>
            <span class="badge rounded-pill" :class="getStatusBadge(lead.status)">{{
              lead.status
            }}</span>
          </div>

          <!-- Info row -->
          <div class="row g-2 mb-2 small">
            <div class="col-6">
              <span class="text-muted">📅 Ngày ĐK:</span>
              <span class="d-block">{{ formatDate(lead.created_at) }}</span>
            </div>
            <div class="col-6">
              <span class="text-muted">🎯 Quan tâm:</span>
              <span class="badge bg-secondary d-block mt-1" style="width: fit-content">{{
                lead.course_interest
              }}</span>
            </div>
          </div>

          <!-- Message -->
          <div v-if="lead.message" class="mb-2 p-2 bg-light rounded small text-secondary">
            <i class="bi bi-chat-left-text me-1"></i>{{ lead.message }}
          </div>

          <!-- Actions -->
          <div class="d-flex gap-2 align-items-center">
            <select
              v-model="lead.status"
              @change="updateStatus(lead.id, lead.status)"
              class="form-select form-select-sm flex-grow-1"
              :class="getStatusColor(lead.status)"
            >
              <option value="Mới">Mới</option>
              <option value="Đã tư vấn">Đã tư vấn</option>
              <option value="Thành công">Thành công</option>
              <option value="Hủy">Hủy</option>
            </select>
            <button
              class="btn btn-sm btn-outline-danger flex-shrink-0"
              @click="deleteLead(lead.id)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
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
        this.leads = this.leads.filter((l) => l.id !== id)
      } catch (error) {
        alert('Lỗi xóa khách hàng!')
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return (
        date.toLocaleDateString('vi-VN') +
        ' ' +
        date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      )
    },
    getStatusColor(status) {
      if (status === 'Mới') return 'text-danger fw-bold'
      if (status === 'Thành công') return 'text-success fw-bold'
      if (status === 'Đã tư vấn') return 'text-primary'
      return 'text-muted'
    },
    getCardBorder(status) {
      if (status === 'Mới') return 'border-warning'
      if (status === 'Thành công') return 'border-success'
      if (status === 'Đã tư vấn') return 'border-primary'
      return 'border-secondary'
    },
    getStatusBadge(status) {
      if (status === 'Mới') return 'bg-warning text-dark'
      if (status === 'Thành công') return 'bg-success'
      if (status === 'Đã tư vấn') return 'bg-primary'
      return 'bg-secondary'
    },
  },
}
</script>

<style scoped>
.section-title {
  font-size: 1.25rem;
}

/* ========== DESKTOP TABLE ========== */
.admin-leads table {
  table-layout: fixed;
  width: 100%;
}
.admin-leads td {
  word-wrap: break-word;
  white-space: normal !important;
}
.admin-leads th:nth-child(1) {
  width: 15%;
}
.admin-leads th:nth-child(2) {
  width: 18%;
}
.admin-leads th:nth-child(3) {
  width: 15%;
}
.admin-leads th:nth-child(4) {
  width: 17%;
}
.admin-leads th:nth-child(5) {
  width: 15%;
}
.admin-leads th:nth-child(6) {
  width: 12%;
}
.admin-leads th:nth-child(7) {
  width: 8%;
}

/* ========== MOBILE CARDS ========== */
.lead-card {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.lead-card:active {
  transform: scale(0.98);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 767.98px) {
  .section-title {
    font-size: 1.1rem;
  }
  .admin-leads .card {
    padding: 0.75rem !important;
  }
}
</style>
