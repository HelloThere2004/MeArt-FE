<template>
  <div class="admin-students">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="section-title mb-0">Quản lý học viên</h3>
      <button class="btn btn-warning fw-bold" @click="showAddForm = !showAddForm">
        <i class="bi" :class="showAddForm ? 'bi-x-circle' : 'bi-plus-circle'"></i> 
        {{ showAddForm ? 'Đóng' : 'Thêm học viên' }}
      </button>
    </div>

    <!-- ========== FORM THÊM HỌC VIÊN ========== -->
    <div v-if="showAddForm" class="card p-3 mb-4 border-warning shadow-sm">
      <h6 class="fw-bold text-warning mb-3">Thêm học viên mới</h6>
      <!-- Tui thêm một cái mẹo nhỏ: Ép người dùng phải nhập ít nhất 1 trong 2 số điện thoại bằng sự kiện @submit -->
      <form @submit.prevent="handleFormSubmit" class="row g-2 align-items-center">
        <div class="col-12 col-md-3">
          <input v-model="newStudent.name" type="text" class="form-control form-control-sm" placeholder="Họ tên học viên *" required />
        </div>
        <div class="col-6 col-md-2">
          <!-- Đã bỏ required và dấu * -->
          <input v-model="newStudent.phone" type="tel" class="form-control form-control-sm" placeholder="SĐT học viên" />
        </div>
        <div class="col-6 col-md-2">
          <input v-model="newStudent.parent_phone" type="tel" class="form-control form-control-sm" placeholder="SĐT phụ huynh" />
        </div>
        <div class="col-12 col-md-2">
          <input v-model="newStudent.email" type="email" class="form-control form-control-sm" placeholder="Email" />
        </div>
        <div class="col-8 col-md-2">
          <select v-model="newStudent.course" class="form-select form-select-sm" required>
            <option value="" disabled>-- Khóa học --</option>
            <option value="Mê Art Class">Mê Art Class</option>
            <option value="Luyện thi Đại học">Luyện thi Đại học</option>
          </select>
        </div>
        <div class="col-4 col-md-1">
          <button type="submit" class="btn btn-sm btn-dark w-100" :disabled="isAdding">
            {{ isAdding ? '...' : 'Lưu' }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <div v-else class="card p-3 p-md-4 bg-light border-0 shadow-sm">
      <!-- ========== DESKTOP TABLE (md+) ========== -->
      <div class="table-responsive d-none d-md-block">
        <table class="table table-hover align-middle bg-white mb-0">
          <thead class="table-dark">
            <tr>
              <th>Ngày vào</th>
              <th>Họ và tên</th>
              <th>SĐT Học viên</th>
              <th>SĐT Phụ huynh</th>
              <th>Email</th>
              <th>Khóa học</th>
              <th>Trạng thái</th>
              <th class="text-center">Xóa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td class="text-muted small">{{ formatDate(student.created_at) }}</td>
              <td class="fw-bold">{{ student.name }}</td>
              <td>
                <!-- Xử lý hiển thị SĐT học viên -->
                <a v-if="student.phone" :href="'tel:' + student.phone" class="text-decoration-none fw-bold">{{ student.phone }}</a>
                <span v-else class="text-muted small">-</span>
              </td>
              <td>
                <!-- Xử lý hiển thị SĐT phụ huynh -->
                <a v-if="student.parent_phone" :href="'tel:' + student.parent_phone" class="text-decoration-none text-info small fw-bold">
                  {{ student.parent_phone }}
                </a>
                <span v-else class="text-muted small">-</span>
              </td>
              <td class="text-muted small">{{ student.email || '-' }}</td>
              <td><span class="badge bg-secondary">{{ student.course }}</span></td>
              <td>
                <select
                  v-model="student.status"
                  @change="updateStatus(student.id, student.status)"
                  class="form-select form-select-sm"
                  :class="getStatusColor(student.status)"
                >
                  <option value="Đang học">Đang học</option>
                  <option value="Bảo lưu">Bảo lưu</option>
                  <option value="Đã nghỉ">Đã nghỉ</option>
                </select>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" @click="deleteStudent(student.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="students.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">Chưa có dữ liệu học viên.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ========== MOBILE CARDS (< md) ========== -->
      <div class="d-md-none">
        <div v-if="students.length === 0" class="text-center py-4 text-muted">
          Chưa có dữ liệu học viên.
        </div>
        <div
          v-for="student in students"
          :key="'m-' + student.id"
          class="student-card mb-3 p-3 bg-white rounded-3 shadow-sm border-start border-4"
          :class="getCardBorder(student.status)"
        >
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 class="mb-0 fw-bold">{{ student.name }}</h6>
              <!-- SĐT Học viên -->
              <a v-if="student.phone" :href="'tel:' + student.phone" class="text-decoration-none fw-bold text-primary small d-block">
                <i class="bi bi-telephone-fill me-1"></i>HV: {{ student.phone }}
              </a>
              <span v-else class="text-muted small d-block"><i class="bi bi-telephone-fill me-1"></i>HV: Không có</span>
              
              <!-- SĐT Phụ huynh -->
              <a v-if="student.parent_phone" :href="'tel:' + student.parent_phone" class="text-decoration-none fw-bold text-info small d-block mt-1">
                <i class="bi bi-telephone-inbound-fill me-1"></i>PH: {{ student.parent_phone }}
              </a>
            </div>
            <span class="badge rounded-pill" :class="getStatusBadge(student.status)">{{ student.status }}</span>
          </div>

          <div class="row g-2 mb-2 small mt-2">
            <div class="col-12 text-muted">
              <i class="bi bi-envelope me-1"></i>{{ student.email || 'Không có email' }}
            </div>
            <div class="col-6">
              <span class="badge bg-secondary">{{ student.course }}</span>
            </div>
            <div class="col-6 text-end text-muted">
              {{ formatDate(student.created_at) }}
            </div>
          </div>

          <div class="d-flex gap-2 align-items-center mt-2">
            <select
              v-model="student.status"
              @change="updateStatus(student.id, student.status)"
              class="form-select form-select-sm flex-grow-1"
              :class="getStatusColor(student.status)"
            >
              <option value="Đang học">Đang học</option>
              <option value="Bảo lưu">Bảo lưu</option>
              <option value="Đã nghỉ">Đã nghỉ</option>
            </select>
            <button class="btn btn-sm btn-outline-danger flex-shrink-0" @click="deleteStudent(student.id)">
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
  name: 'AdminStudents',
  data() {
    return {
      students: [],
      loading: true,
      showAddForm: false,
      isAdding: false,
      newStudent: {
        name: '',
        phone: '',
        parent_phone: '',
        email: '',
        course: ''
      }
    }
  },
  async mounted() {
    await this.fetchStudents()
  },
  methods: {
    async fetchStudents() {
      this.loading = true
      const { data, error } = await supabase
        .from('student')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Lỗi tải danh sách học viên:', error.message)
      } else {
        this.students = data || []
      }
      this.loading = false
    },
    handleFormSubmit() {
      // Validate: Ép phải có ít nhất 1 trong 2 số điện thoại để trung tâm còn đường liên lạc
      if (!this.newStudent.phone && !this.newStudent.parent_phone) {
        alert('Vui lòng nhập ít nhất SĐT học viên hoặc SĐT phụ huynh!')
        return
      }
      this.addStudent()
    },
    async addStudent() {
      this.isAdding = true
      try {
        // Lọc bỏ chuỗi rỗng thành null trước khi đẩy lên DB
        const payload = { ...this.newStudent }
        if (!payload.phone) payload.phone = null
        if (!payload.parent_phone) payload.parent_phone = null
        if (!payload.email) payload.email = null

        const { data, error } = await supabase
          .from('student')
          .insert([payload])
          .select()

        if (error) throw error

        if (data && data.length > 0) {
          this.students.unshift(data[0])
        }
        
        // Reset form
        this.newStudent = { name: '', phone: '', parent_phone: '', email: '', course: '' }
        this.showAddForm = false
      } catch (error) {
        console.error('Lỗi thêm học viên:', error.message)
        alert('Thêm học viên thất bại!')
      } finally {
        this.isAdding = false
      }
    },
    async updateStatus(id, newStatus) {
      try {
        const { error } = await supabase
          .from('student')
          .update({ status: newStatus })
          .eq('id', id)

        if (error) throw error
      } catch (error) {
        console.error('Lỗi cập nhật:', error.message)
        alert('Cập nhật trạng thái thất bại!')
      }
    },
    async deleteStudent(id) {
      if (!confirm('Bạn có chắc muốn xóa học viên này? Dữ liệu không thể khôi phục!')) return
      try {
        const { error } = await supabase.from('student').delete().eq('id', id)
        if (error) throw error
        this.students = this.students.filter((s) => s.id !== id)
      } catch (error) {
        alert('Lỗi xóa học viên!')
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('vi-VN')
    },
    getStatusColor(status) {
      if (status === 'Đang học') return 'text-success fw-bold'
      if (status === 'Bảo lưu') return 'text-warning fw-bold text-dark'
      return 'text-danger'
    },
    getCardBorder(status) {
      if (status === 'Đang học') return 'border-success'
      if (status === 'Bảo lưu') return 'border-warning'
      return 'border-danger'
    },
    getStatusBadge(status) {
      if (status === 'Đang học') return 'bg-success'
      if (status === 'Bảo lưu') return 'bg-warning text-dark'
      return 'bg-danger'
    }
  }
}
</script>

<style scoped>
.section-title {
  font-size: 1.25rem;
  font-weight: bold;
}

/* ========== DESKTOP TABLE ========== */
.admin-students table {
  table-layout: fixed;
  width: 100%;
}
.admin-students td {
  word-wrap: break-word;
  white-space: normal !important;
}

.admin-students th:nth-child(1) { width: 10%; } /* Ngày vào */
.admin-students th:nth-child(2) { width: 16%; } /* Họ tên */
.admin-students th:nth-child(3) { width: 12%; } /* SĐT Học viên */
.admin-students th:nth-child(4) { width: 12%; } /* SĐT Phụ huynh */
.admin-students th:nth-child(5) { width: 15%; } /* Email */
.admin-students th:nth-child(6) { width: 14%; } /* Khóa học */
.admin-students th:nth-child(7) { width: 14%; } /* Trạng thái */
.admin-students th:nth-child(8) { width: 7%; }  /* Xóa */

/* ========== MOBILE CARDS ========== */
.student-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.student-card:active {
  transform: scale(0.98);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 767.98px) {
  .section-title {
    font-size: 1.1rem;
  }
  .admin-students .card {
    padding: 0.75rem !important;
  }
}
</style>