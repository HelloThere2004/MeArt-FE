<template>
  <div class="admin-students">
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
      <h3 class="section-title mb-0">Quản lý học viên</h3>
      
      <div class="d-flex flex-wrap gap-2 align-items-center flex-grow-1 flex-md-grow-0 justify-content-md-end">
        
        <div class="input-group input-group-sm" style="max-width: 200px; flex-grow: 1;">
          <span class="input-group-text bg-white text-muted border-end-0">
            <i class="bi bi-search"></i>
          </span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control border-start-0 ps-0" 
            placeholder="Tìm tên học viên..." 
          />
        </div>

        <select v-model="filterCourse" class="form-select form-select-sm w-auto flex-grow-1 flex-md-grow-0">
          <option value="">Tất cả Khóa học</option>
          <option value="Học vẽ tự do">Học vẽ tự do</option>
          <option value="Luyện thi Đại học">Luyện thi Đại học</option>
        </select>
        
        <select v-model="filterStatus" class="form-select form-select-sm w-auto flex-grow-1 flex-md-grow-0">
          <option value="">Tất cả Trạng thái</option>
          <option value="Đang học">Đang học</option>
          <option value="Bảo lưu">Bảo lưu</option>
          <option value="Đã nghỉ">Đã nghỉ</option>
        </select>

        <button class="btn btn-sm btn-warning fw-bold text-nowrap flex-grow-1 flex-md-grow-0" @click="toggleForm">
          <i class="bi" :class="showForm ? 'bi-x-circle' : 'bi-plus-circle'"></i> 
          <span class="d-none d-md-inline">{{ showForm ? 'Đóng Form' : 'Thêm học viên' }}</span>
          <span class="d-inline d-md-none">{{ showForm ? 'Đóng' : 'Thêm' }}</span>
        </button>
      </div>
    </div>

    <div v-if="showForm" class="card p-3 mb-4 shadow-sm" :class="isEditing ? 'border-primary' : 'border-warning'">
      <h6 class="fw-bold mb-3" :class="isEditing ? 'text-primary' : 'text-warning'">
        {{ isEditing ? 'Cập nhật thông tin học viên' : 'Thêm học viên mới' }}
      </h6>
      <form @submit.prevent="handleFormSubmit" class="row g-2 align-items-center">
        <div class="col-12 col-md-2">
          <input v-model="currentForm.name" type="text" class="form-control form-control-sm" placeholder="Họ tên học viên *" required />
        </div>
        <div class="col-6 col-md-2">
          <input v-model="currentForm.phone" type="tel" class="form-control form-control-sm" placeholder="SĐT học viên" />
        </div>
        <div class="col-6 col-md-2">
          <input v-model="currentForm.parent_phone" type="tel" class="form-control form-control-sm" placeholder="SĐT phụ huynh" />
        </div>
        <div class="col-12 col-md-2">
          <input v-model="currentForm.email" type="email" class="form-control form-control-sm" placeholder="Email" />
        </div>
        <div class="col-8 col-md-2">
          <select v-model="currentForm.course" class="form-select form-select-sm" required>
            <option value="" disabled>-- Khóa học --</option>
            <option value="Học vẽ tự do">Học vẽ tự do</option>
            <option value="Luyện thi Đại học">Luyện thi Đại học</option>
          </select>
        </div>
        <div class="col-4 col-md-2 d-flex gap-1">
          <button type="submit" class="btn btn-sm w-100 fw-bold" :class="isEditing ? 'btn-primary' : 'btn-dark'" :disabled="isSaving">
            {{ isSaving ? '...' : 'Lưu' }}
          </button>
          <button v-if="isEditing" type="button" class="btn btn-sm btn-outline-secondary w-100" @click="resetForm">
            Hủy
          </button>
        </div>
      </form>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <div v-else class="card p-3 p-md-4 bg-light border-0 shadow-sm">
      
      <div v-if="filteredStudents.length === 0 && students.length > 0" class="alert alert-info text-center mb-0">
        <i class="bi bi-search me-2"></i>Không tìm thấy học viên nào khớp với tìm kiếm hoặc bộ lọc.
      </div>

      <div v-if="filteredStudents.length > 0" class="table-responsive d-none d-md-block">
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
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id">
              <td class="text-muted small">{{ formatDate(student.created_at) }}</td>
              <td class="fw-bold">{{ student.name }}</td>
              <td>
                <a v-if="student.phone" :href="'tel:' + student.phone" class="text-decoration-none fw-bold">{{ student.phone }}</a>
                <span v-else class="text-muted small">-</span>
              </td>
              <td>
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
                <div class="d-flex justify-content-center gap-1">
                  <button class="btn btn-sm btn-outline-primary" @click="editStudent(student)" title="Sửa thông tin">
                    <i class="bi bi-pencil-square"></i>
                    Sửa
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteStudent(student.id)" title="Xóa học viên">
                    <i class="bi bi-trash"></i>
                    Xoá
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredStudents.length > 0" class="d-md-none">
        <div
          v-for="student in filteredStudents"
          :key="'m-' + student.id"
          class="student-card mb-3 p-3 bg-white rounded-3 shadow-sm border-start border-4"
          :class="getCardBorder(student.status)"
        >
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 class="mb-0 fw-bold">{{ student.name }}</h6>
              <a v-if="student.phone" :href="'tel:' + student.phone" class="text-decoration-none fw-bold text-primary small d-block">
                <i class="bi bi-telephone-fill me-1"></i>HV: {{ student.phone }}
              </a>
              <span v-else class="text-muted small d-block"><i class="bi bi-telephone-fill me-1"></i>HV: Không có</span>
              
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
            <button class="btn btn-sm btn-outline-primary flex-shrink-0" @click="editStudent(student)">
              <i class="bi bi-pencil-square"></i> Sửa
            </button>
            <button class="btn btn-sm btn-outline-danger flex-shrink-0" @click="deleteStudent(student.id)">
              <i class="bi bi-trash"></i> Xóa
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="students.length === 0" class="text-center py-4 text-muted">
        Chưa có dữ liệu học viên.
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
      
      // Biến lưu trạng thái của bộ lọc và tìm kiếm
      searchQuery: '',
      filterCourse: '',
      filterStatus: '',
      
      showForm: false,
      isEditing: false,
      isSaving: false,
      currentForm: {
        id: null,
        name: '',
        phone: '',
        parent_phone: '',
        email: '',
        course: ''
      }
    }
  },
  computed: {
    filteredStudents() {
      // Ép về chữ thường và xóa khoảng trắng 2 đầu để tìm kiếm chuẩn xác
      const query = this.searchQuery.toLowerCase().trim();
      
      return this.students.filter(student => {
        // Kiểm tra xem tên có chứa chữ đang gõ không
        const matchName = student.name.toLowerCase().includes(query);
        // Kiểm tra theo 2 Dropdown
        const matchCourse = this.filterCourse === '' || student.course === this.filterCourse;
        const matchStatus = this.filterStatus === '' || student.status === this.filterStatus;
        
        // Học viên phải thỏa mãn cả 3 điều kiện: Tìm tên + Khóa học + Trạng thái
        return matchName && matchCourse && matchStatus;
      });
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
    
    toggleForm() {
      if (this.showForm && this.isEditing) {
        this.resetForm()
      } else {
        this.showForm = !this.showForm
      }
    },

    resetForm() {
      this.isEditing = false
      this.currentForm = { id: null, name: '', phone: '', parent_phone: '', email: '', course: '' }
      this.showForm = false
    },

    editStudent(student) {
      this.currentForm = { ...student }
      this.isEditing = true
      this.showForm = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    handleFormSubmit() {
      if (!this.currentForm.phone && !this.currentForm.parent_phone) {
        alert('Vui lòng nhập ít nhất SĐT học viên hoặc SĐT phụ huynh!')
        return
      }
      this.saveStudent()
    },

    async saveStudent() {
      this.isSaving = true
      try {
        const payload = { ...this.currentForm }
        if (!payload.phone) payload.phone = null
        if (!payload.parent_phone) payload.parent_phone = null
        if (!payload.email) payload.email = null

        if (this.isEditing) {
          const { id, ...updateData } = payload 
          const { error } = await supabase
            .from('student')
            .update(updateData)
            .eq('id', id)

          if (error) throw error
          
          const index = this.students.findIndex(s => s.id === id)
          if (index !== -1) {
            this.students[index] = { ...this.students[index], ...updateData }
          }
        } else {
          const { id, ...insertData } = payload
          const { data, error } = await supabase
            .from('student')
            .insert([insertData])
            .select()

          if (error) throw error

          if (data && data.length > 0) {
            this.students.unshift(data[0])
          }
        }
        
        this.resetForm()
      } catch (error) {
        console.error('Lỗi lưu thông tin:', error.message)
        alert('Thao tác thất bại!')
      } finally {
        this.isSaving = false
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

/* Custom cho input có icon không bị gãy khung */
.input-group-text {
  border-color: #dee2e6;
}
.input-group .form-control {
  border-color: #dee2e6;
}
.input-group .form-control:focus {
  border-color: #dee2e6;
  box-shadow: none;
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
.admin-students th:nth-child(2) { width: 15%; } /* Họ tên */
.admin-students th:nth-child(3) { width: 12%; } /* SĐT Học viên */
.admin-students th:nth-child(4) { width: 12%; } /* SĐT Phụ huynh */
.admin-students th:nth-child(5) { width: 14%; } /* Email */
.admin-students th:nth-child(6) { width: 12%; } /* Khóa học */
.admin-students th:nth-child(7) { width: 13%; } /* Trạng thái */
.admin-students th:nth-child(8) { width: 12%; } /* Hành động (Đã nới rộng) */

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