<template>
  <header class="header-wrapper" :class="{ 'push-content-down': $route.path !== '/' }">
    <nav class="navbar navbar-expand-lg navbar-dark custom-navbar">
      <div class="container-fluid position-relative">
        
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          @click="toggleMenu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <RouterLink to="/" class="navbar-brand navbar-brand-center d-flex align-items-center gap-2">
          <img src="../assets/image/logo.jpg" alt="MeArt Logo" class="nav-logo" />
          <span class="brand-text">Mê Art</span>
        </RouterLink>

        <div class="collapse navbar-collapse" id="navbarNav" :class="{ show: menuOpen }">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink to="/" class="nav-link" @click="closeMenu">Trang chủ</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/lichhoc" class="nav-link" @click="closeMenu">Lịch học</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/gallery" class="nav-link" @click="closeMenu">Tác phẩm</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/outstanding-students" class="nav-link" @click="closeMenu">Học viên tiêu biểu</RouterLink>
            </li>
          </ul>

          <ul class="navbar-nav ms-auto align-items-lg-center">
            <li class="nav-item">
              <RouterLink to="/posts" class="nav-link" @click="closeMenu">Bài viết</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/about" class="nav-link" @click="closeMenu">Về chúng tôi</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/register" class="nav-link" @click="closeMenu">Đăng ký học thử</RouterLink>
            </li>
            <li class="nav-item ms-lg-3 mt-3 mt-lg-0 d-flex gap-2 justify-content-center align-items-center">
              <template v-if="isAuthenticated">
                <span class="user-greeting">
                  <i class="bi bi-person-circle me-1"></i>{{ userName }}
                </span>
                <RouterLink to="/admin" class="btn btn-outline-light-custom btn-sm" title="Admin">
                  <i class="bi bi-speedometer2"></i> Admin
                </RouterLink>
                <button @click="handleLogout" class="btn btn-light-custom btn-sm" title="Đăng xuất">
                  <i class="bi bi-box-arrow-right"></i> Đăng xuất
                </button>
              </template>
              <template v-else>
                <RouterLink to="/login" class="btn btn-outline-light-custom btn-sm fw-bold" @click="closeMenu">
                  <i class="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                </RouterLink>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { RouterLink, useRoute } from 'vue-router'
import { supabase } from '@/utils/supabase.js'

export default {
  name: 'NavBar',
  components: { RouterLink },
  data() {
    return {
      isAuthenticated: false,
      menuOpen: false,
      userName: '',
    }
  },
  async mounted() {
    await this.checkAuth()
    supabase.auth.onAuthStateChange((event, session) => {
      this.isAuthenticated = !!session
      if (session) {
        this.fetchUserName(session.user)
      } else {
        this.userName = ''
      }
    })
  },
  methods: {
    toggleMenu() { this.menuOpen = !this.menuOpen },
    closeMenu() { this.menuOpen = false },
    async checkAuth() {
      const { data } = await supabase.auth.getSession()
      this.isAuthenticated = !!data.session
      if (data.session) {
        this.fetchUserName(data.session.user)
      }
    },
    fetchUserName(user) {
      const meta = user?.user_metadata || {}
      this.userName = meta.name || meta.full_name || user?.email?.split('@')[0] || 'User'
    },
    async handleLogout() {
      await supabase.auth.signOut()
      this.isAuthenticated = false
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.header-wrapper {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.custom-navbar {
  background-color: #1e40af; 
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 1rem;
}

/* --- LOGO CSS --- */
.nav-logo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  /* ĐÃ XÓA VIỀN TRẮNG THEO YÊU CẦU */
  transition: transform 0.3s ease;
  background-color: transparent;
}

.nav-logo:hover {
  transform: scale(1.1);
}

.brand-text {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

/* Giao diện PC: Logo lấn viền, ẩn chữ */
@media (min-width: 992px) {
  .navbar-brand-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    top: 5px; 
    z-index: 1050; 
  }

  .brand-text {
    display: none !important; 
  }

  .nav-logo {
    width: 80px; 
    height: 80px;
    /* ĐÃ XÓA VIỀN TRẮNG THEO YÊU CẦU */
    box-shadow: 0 6px 12px rgba(0,0,0,0.2);
    transform: translateY(20px); 
  }

  .nav-logo:hover {
    transform: translateY(20px) scale(1.05);
  }

  /* CLASS CHÌA KHÓA: Đẩy nội dung các trang khác xuống để không bị logo đè */
  .push-content-down {
    margin-bottom: 45px;
  }
}

/* --- NAV LINKS & BUTTONS CSS --- */
.nav-link {
  color: #f8fafc !important; 
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin: 0 2px;
}

.nav-link:hover, .nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: #fff !important;
}

.btn-outline-light-custom {
  border: 2px solid #fff;
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-outline-light-custom:hover {
  background-color: #fff;
  color: #1e40af;
}

.btn-light-custom {
  background-color: #fff;
  border: 2px solid #fff;
  color: #1e40af;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-light-custom:hover {
  background-color: #f1f5f9;
  border-color: #f1f5f9;
}

.user-greeting {
  color: #1e40af;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  background: #fff;
  border-radius: 20px;
}

@media (max-width: 991px) {
  .navbar-nav {
    padding-top: 0.5rem;
  }
}
</style>