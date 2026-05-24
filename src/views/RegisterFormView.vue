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
          <option value="Mê Art Class (Học vẽ tự do)">Học vẽ tự do</option>
          <option value="Luyện thi Đại học">Luyện thi Đại học (Kiến trúc, Mỹ thuật)</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Giờ học mong muốn *</label>
        <select v-model="formData.preferred_time" class="form-select" required :disabled="isLoadingSlots">
          <option value="" disabled>
            {{ isLoadingSlots ? 'Đang tải lịch học...' : '-- Chọn thời gian --' }}
          </option>
          <!-- Load tự động và nối chuỗi từ bảng timetable -->
          <option v-for="slot in timeSlots" :key="slot.id" :value="slot.full_label">
            {{ slot.full_label }}
          </option>
          <!-- Option thủ công nằm cuối -->
          <option value="Chưa xác định / Cần tư vấn">Chưa xác định / Cần tư vấn</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="form-label fw-bold">Lời nhắn thêm (không bắt buộc)</label>
        <textarea v-model="formData.message" class="form-control" rows="2" placeholder="Bạn muốn hỏi thêm gì không?"></textarea>
      </div>

      <button type="submit" class="btn btn-warning w-100 fw-bold" :disabled="isSubmitting || isLoadingSlots">
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
        preferred_time: '', 
        message: ''
      },
      timeSlots: [], 
      isLoadingSlots: false,
      isSubmitting: false,
      isSuccess: false
    }
  },
  async mounted() {
    await this.fetchTimeSlots()
  },
  methods: {
    async fetchTimeSlots() {
      this.isLoadingSlots = true
      try {
        // Lấy full tất cả các cột ngày trong tuần
        const { data, error } = await supabase
          .from('timetable')
          .select('id, time_slot, t2, t3, t4, t5, t6, t7, cn')
          .order('sort_order', { ascending: true })

        if (error) throw error
        
        // Xử lý data: Lọc qua các ngày có giá trị TRUE và nối lại thành chuỗi
        this.timeSlots = (data || []).map(slot => {
          let days = []
          if (slot.t2) days.push('T2')
          if (slot.t3) days.push('T3')
          if (slot.t4) days.push('T4')
          if (slot.t5) days.push('T5')
          if (slot.t6) days.push('T6')
          if (slot.t7) days.push('T7')
          if (slot.cn) days.push('CN')
          
          // Tạo chuỗi hiển thị, ví dụ: "8h - 12h (T7, CN)"
          const daysString = days.length > 0 ? ` (${days.join(', ')})` : ''
          const full_label = `${slot.time_slot}${daysString}`
          
          return {
            id: slot.id,
            full_label: full_label
          }
        })

      } catch (error) {
        console.error('Lỗi tải danh sách giờ học:', error.message)
      } finally {
        this.isLoadingSlots = false
      }
    },
    async submitForm() {
      this.isSubmitting = true
      try {
        const { error } = await supabase
          .from('registerForm')
          .insert([this.formData])

        if (error) throw error
        
        this.isSuccess = true
        this.formData = { name: '', phone: '', course_interest: '', preferred_time: '', message: '' }
        
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