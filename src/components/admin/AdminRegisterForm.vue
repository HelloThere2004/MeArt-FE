<template>
  <div class="admin-registrations">
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
              <th>Giờ học</th>
              <th>Lời nhắn</th>
              <th>Trạng thái</th>
              <th class="text-center">Xóa</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="reg in registrations"
              :key="reg.id"
              :class="{
                'table-success': reg.status === 'Thành công',
                'table-warning': reg.status === 'Mới',
              }"
            >
              <td class="text-muted small">{{ formatDate(reg.created_at) }}</td>
              <td class="fw-bold">{{ reg.name }}</td>
              <td>
                <a :href="'tel:' + reg.phone" class="text-decoration-none fw-bold text-primary">{{
                  reg.phone
                }}</a>
              </td>
              <td>
                <span class="badge bg-secondary">{{ reg.course_interest }}</span>
              </td>
              <td>
                <span class="badge bg-info text-dark">{{ reg.preferred_time || '-' }}</span>
              </td>
              <td style="max-width: 200px; white-space: normal">{{ reg.message || '-' }}</td>
              <td>
                <select
                  v-model="reg.status"
                  @change="updateStatus(reg.id, reg.status)"
                  class="form-select form-select-sm"
                  :class="getStatusColor(reg.status)"
                >
                  <option value="Mới">Mới</option>
                  <option value="Đã tư vấn">Đã tư vấn</option>
                  <option value="Thành công">Thành công</option>
                  <option value="Hủy">Hủy</option>
                </select>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" @click="deleteRegistration(reg.id)">
                  <i class="bi bi-trash"></i> Xóa
                </button>
              </td>
            </tr>
            <tr v-if="registrations.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">Chưa có khách đăng ký nào.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ========== MOBILE CARDS (< md) ========== -->
      <div class="d-md-none">
        <div v-if="registrations.length === 0" class="text-center py-4 text-muted">
          Chưa có khách đăng ký nào.
        </div>
        <div
          v-for="reg in registrations"
          :key="'m-' + reg.id"
          class="registration-card mb-3 p-3 bg-white rounded-3 shadow-sm border-start border-4"
          :class="getCardBorder(reg.status)"
        >
          <!-- Header: name + date -->
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 class="mb-0 fw-bold">{{ reg.name }}</h6>
              <a
                :href="'tel:' + reg.phone"
                class="text-decoration-none fw-bold text-primary small"
              >
                <i class="bi bi-telephone-fill me-1"></i>{{ reg.phone }}
              </a>
            </div>
            <span class="badge rounded-pill" :class="getStatusBadge(reg.status)">{{
              reg.status
            }}</span>
          </div>

          <!-- Info row (Responsive Grid) -->
          <div class="row g-2 mb-2 small">
            <div class="col-12">
              <span class="text-muted"><i class="bi bi-calendar-event me-1"></i>ĐK:</span>
              <span> {{ formatDate(reg.created_at) }}</span>
            </div>
            <div class="col-12 col-sm-6">
              <span class="text-muted"><i class="bi bi-bullseye me-1"></i>Quan tâm:</span>
              <span class="badge bg-secondary ms-1">{{ reg.course_interest }}</span>
            </div>
            <div class="col-12 col-sm-6">
              <span class="text-muted"><i class="bi bi-clock me-1"></i>Giờ học:</span>
              <span class="badge bg-info text-dark ms-1">{{ reg.preferred_time || '-' }}</span>
            </div>
          </div>

          <!-- Message -->
          <div v-if="reg.message" class="mb-3 p-2 bg-light rounded small text-secondary">
            <i class="bi bi-chat-left-text me-1"></i>{{ reg.message }}
          </div>

          <!-- Actions -->
          <div class="d-flex gap-2 align-items-center mt-2">
            <select
              v-model="reg.status"
              @change="updateStatus(reg.id, reg.status)"
              class="form-select form-select-sm flex-grow-1"
              :class="getStatusColor(reg.status)"
            >
              <option value="Mới">Mới</option>
              <option value="Đã tư vấn">Đã tư vấn</option>
              <option value="Thành công">Thành công</option>
              <option value="Hủy">Hủy</option>
            </select>
            <button
              class="btn btn-sm btn-outline-danger flex-shrink-0"
              @click="deleteRegistration(reg.id)"
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
  name: 'AdminRegistrations',
  data() {
    return {
      registrations: [],
      loading: true,
    }
  },
  async mounted() {
    await this.fetchRegistrations()
  },
  methods: {
    async fetchRegistrations() {
      this.loading = true
      const { data, error } = await supabase
        .from('registerForm')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Lỗi tải data đăng ký:', error.message)
      } else {
        this.registrations = data || []
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
    async deleteRegistration(id) {
      if (!confirm('Xóa thông tin đăng ký này?')) return
      try {
        const { error } = await supabase.from('registerForm').delete().eq('id', id)
        if (error) throw error
        this.registrations = this.registrations.filter((r) => r.id !== id)
      } catch (error) {
        alert('Lỗi xóa đăng ký!')
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
.admin-registrations table {
  table-layout: fixed;
  width: 100%;
}
.admin-registrations td {
  word-wrap: break-word;
  white-space: normal !important;
}

/* Chỉnh lại tỷ lệ width cho 8 cột */
.admin-registrations th:nth-child(1) { width: 12%; } /* Ngày ĐK */
.admin-registrations th:nth-child(2) { width: 15%; } /* Khách hàng */
.admin-registrations th:nth-child(3) { width: 12%; } /* Số ĐT */
.admin-registrations th:nth-child(4) { width: 15%; } /* Quan tâm */
.admin-registrations th:nth-child(5) { width: 12%; } /* Giờ học */
.admin-registrations th:nth-child(6) { width: 15%; } /* Lời nhắn */
.admin-registrations th:nth-child(7) { width: 12%; } /* Trạng thái */
.admin-registrations th:nth-child(8) { width: 7%; }  /* Xóa */

/* ========== MOBILE CARDS ========== */
.registration-card {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.registration-card:active {
  transform: scale(0.98);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 767.98px) {
  .section-title {
    font-size: 1.1rem;
  }
  .admin-registrations .card {
    padding: 0.75rem !important;
  }
}
</style>