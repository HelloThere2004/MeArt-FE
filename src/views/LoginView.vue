<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow-sm" style="width: 400px; border-radius: 12px;">
      <div class="text-center mb-4">
        <h3 class="fw-bold">Mê Art Studio</h3>
        <p class="text-muted">Đăng nhập hệ thống quản trị</p>
      </div>

      <div v-if="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" required placeholder="admin@meart.com">
        </div>
        <div class="mb-4">
          <label class="form-label">Mật khẩu</label>
          <input v-model="password" type="password" class="form-control" required placeholder="••••••••">
        </div>
        <button type="submit" class="btn btn-dark w-100" :disabled="isLoading">
          {{ isLoading ? 'Đang xác thực...' : 'Đăng nhập' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      errorMsg: ''
    }
  },
  methods: {
    async handleLogin() {
      this.isLoading = true
      this.errorMsg = ''

      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      })

      if (error) {
        this.errorMsg = 'Sai email hoặc mật khẩu!'
      } else {
        this.$router.push('/admin')
      }
      this.isLoading = false
    }
  }
}
</script>