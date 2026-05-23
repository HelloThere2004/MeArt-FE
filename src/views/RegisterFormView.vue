<template>
  <div class="register-form card p-4 shadow-sm border-0 bg-light">
    <h4 class="fw-bold mb-3 text-center">Đăng Ký Tư Vấn / Học Thử</h4>
    <p class="text-muted text-center mb-4">Để lại thông tin, Mê Art sẽ liên hệ với bạn sớm nhất nhé!</p>

    <div v-if="isSuccess" class="alert alert-success text-center">
      🎉 Đăng ký thành công! Mê Art sẽ gọi cho bạn sớm nha.
    </div>

    <form v-else @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label fw-bold">Họ và Tên *</label>
        <input v-model="formData.name" type="text" class="form-control" required placeholder="Nhập tên của bạn..." />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Số điện thoại *</label>
        <input v-model="formData.phone" type="tel" class="form-control" required placeholder="09xx..." pattern="[0-9]{10,11}" title="Vui lòng nhập đúng số điện thoại" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Bạn quan tâm đến? *</label>
        <select v-model="formData.course_interest" class="form-select" required>
          <option value="" disabled>-- Chọn lớp học --</option>
          <option value="Mê Art Class (Học vẽ tự do)">Mê Art Class (Học vẽ tự do)</option>
          <option value="Luyện thi Đại học">Luyện thi Đại học (Kiến trúc, Mỹ thuật)</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      <!-- TRƯỜNG CHỌN GIỜ HỌC MỚI -->
      <div class="mb-3">
        <label class="form-label fw-bold">Giờ học mong muốn *</label>
        <select v-model="formData.preferred_time" class="form-select" required>
          <option value="" disabled>-- Chọn thời gian --</option>
          <option value="Sáng (8h - 11h)">Sáng (8h - 11h)</option>
          <option value="Chiều (14h - 17h)">Chiều (14h - 17h)</option>
          <option value="Tối (18h - 21h)">Tối (18h - 21h)</option>
          <option value="Cuối tuần (Thứ 7 - CN)">Cuối tuần (Thứ 7 - CN)</option>
          <option value="Chưa xác định / Cần tư vấn">Chưa xác định / Cần tư vấn</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="form-label fw-bold">Lời nhắn thêm (không bắt buộc)</label>
        <textarea v-model="formData.message" class="form-control" rows="2" placeholder="Bạn muốn hỏi thêm gì không?"></textarea>
      </div>

      <button type="submit" class="btn btn-warning w-100 fw-bold" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
        {{ isSubmitting ? 'Đang gửi...' : 'Gửi Thông Tin' }}
      </button>
    </form>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabase.js'

export default {
  name: 'RegisterForm',
  data() {
    return {
      formData: {
        name: '',
        phone: '',
        course_interest: '',
        preferred_time: '', // State mới
        message: ''
      },
      isSubmitting: false,
      isSuccess: false
    }
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true
      try {
        const { error } = await supabase
          .from('registerForm')
          .insert([this.formData])

        if (error) throw error
        
        this.isSuccess = true
        // Xóa form sau khi gửi
        this.formData = { name: '', phone: '', course_interest: '', preferred_time: '', message: '' }
        
        // Reset thông báo sau 5 giây
        setTimeout(() => {
          this.isSuccess = false
        }, 5000)

      } catch (error) {
        console.error('Lỗi gửi form:', error.message)
        alert('Có lỗi xảy ra, vui lòng thử lại sau!')
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>