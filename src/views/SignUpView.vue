<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card p-4 shadow-sm" style="width: 450px; border-radius: 12px;">
      <div class="text-center mb-4">
        <h3 class="fw-bold">Mê Art Studio</h3>
        <p class="text-muted">Đăng ký tài khoản Học viên</p>
      </div>

      <div v-if="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>
      <div v-if="successMsg" class="alert alert-success py-2">{{ successMsg }}</div>

      <form @submit.prevent="handleSignUp">
        <div class="mb-3">
          <label class="form-label">Họ và Tên</label>
          <input v-model="fullName" type="text" class="form-control" required placeholder="VD: Nguyễn Văn A">
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" required placeholder="hocvien@email.com">
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input v-model="password" type="password" class="form-control" required minlength="6" placeholder="Ít nhất 6 ký tự">
        </div>

        <div class="mb-4">
          <label class="form-label">Xác nhận Mật khẩu</label>
          <input v-model="confirmPassword" type="password" class="form-control" required placeholder="Nhập lại mật khẩu">
        </div>

        <button type="submit" class="btn btn-dark w-100 mb-3" :disabled="isLoading">
          {{ isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký' }}
        </button>

        <div class="text-center">
          <span class="text-muted">Đã có tài khoản? </span>
          <router-link to="/login" class="text-decoration-none fw-bold text-dark">Đăng nhập ngay</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// Lưu ý: Đăng ký thì xài ANON_KEY bình thường nhé
const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  name: 'SignUpView',
  data() {
    return {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isLoading: false,
      errorMsg: '',
      successMsg: ''
    }
  },
  methods: {
    async handleSignUp() {
      // 1. Kiểm tra mật khẩu khớp nhau chưa (Validate cơ bản ở Frontend)
      if (this.password !== this.confirmPassword) {
        this.errorMsg = 'Ê, hai ô mật khẩu không khớp nhau kìa!'
        return
      }

      this.isLoading = true
      this.errorMsg = ''
      this.successMsg = ''

      // 2. Bắn API tạo tài khoản lên Supabase
      const { data, error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
        options: {
          data: {
            full_name: this.fullName,
            role: 'student' // Đóng mác học viên mặc định để xài RLS phân quyền
          }
        }
      })

      if (error) {
        this.errorMsg = 'Lỗi rồi: ' + error.message
      } else {
        // 3. Xử lý UI khi thành công
        this.successMsg = 'Đăng ký thành công! Đang chuyển về trang Đăng nhập...'
        
        // Reset form cho sạch
        this.fullName = ''
        this.email = ''
        this.password = ''
        this.confirmPassword = ''

        // Nếu Supabase ĐANG BẬT "Confirm Email" thì sửa câu thông báo trên thành:
        // this.successMsg = 'Đăng ký thành công! Vui lòng check email để kích hoạt.'
        
        // Đá người dùng về trang Login sau 2 giây
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
      }
      
      this.isLoading = false
    }
  }
}
</script>