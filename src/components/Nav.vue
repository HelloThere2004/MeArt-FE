<template>
  <header class="header-wrapper" :class="{ 'push-content-down': $route.path !== '/' }">
    <nav class="navbar navbar-expand-lg navbar-dark custom-navbar position-relative">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          @click="toggleMenu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <RouterLink to="/" class="navbar-brand navbar-brand-center d-flex align-items-center">
          <img src="../assets/image/logo.jpg" alt="MeArt Logo" class="nav-logo" />
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
            
          </ul>

          <ul class="navbar-nav ms-auto align-items-lg-center">
            <li class="nav-item">
              <RouterLink to="/posts" class="nav-link" @click="closeMenu">Bài viết</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/about" class="nav-link" @click="closeMenu">Về chúng tôi</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/outstanding-students" class="nav-link" @click="closeMenu"
                >Học viên tiêu biểu</RouterLink
              >
            </li>
            <!-- <li class="nav-item">
              <RouterLink to="/register" class="nav-link" @click="closeMenu"
                >Đăng ký học thử</RouterLink
              >
            </li> -->

            <li
              class="nav-item ms-lg-3 mt-3 mt-lg-0 d-flex flex-column flex-lg-row gap-2 justify-content-center align-items-center auth-section"
            >
              <template v-if="isAuthenticated">
                <span class="user-greeting text-center w-100">
                  <i class="bi bi-person-circle me-1"></i>{{ userName }}
                </span>
                <div class="d-flex w-100 gap-2">
                  <RouterLink
                    to="/admin"
                    class="btn btn-outline-light-custom btn-sm flex-fill"
                    title="Admin"
                  >
                    <i class="bi bi-speedometer2"></i> Admin
                  </RouterLink>
                  <button
                    @click="handleLogout"
                    class="btn btn-light-custom btn-sm flex-fill"
                    title="Đăng xuất"
                  >
                    <i class="bi bi-box-arrow-right"></i> Thoát
                  </button>
                </div>
              </template>
              <template v-else>
                <RouterLink
                  to="/login"
                  class="btn btn-outline-light-custom btn-sm fw-bold w-100 mt-2 mt-lg-0"
                  @click="closeMenu"
                >
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
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    },
    closeMenu() {
      this.menuOpen = false
    },
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
  font-family: Arial, sans-serif;
}

.custom-navbar {
  background-color: #1e40af;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  /* 1. Đã tăng độ dày cho NavBar lên một chút */
  padding: 1.4rem 1rem;
}

/* --- LOGO CSS --- */
.nav-logo {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s ease;
  background-color: transparent;
}

/* GIAO DIỆN PC */
@media (min-width: 992px) {
  .navbar-collapse {
    display: flex !important;
    width: 100%;
  }

  /* 1. Ép menu bên trái chiếm đúng 50% chiều ngang */
  .navbar-nav.me-auto {
    margin-right: 0 !important;   /* Xóa bỏ margin mặc định của Bootstrap */
    flex: 1;
    display: flex;
    justify-content: flex-end;    /* Đẩy các mục bên trái tiến về phía logo */
    padding-right: 80px;          /* VÙNG CẤM ĐỊA: Né nửa cái logo bên trái (110px/2 = 55px + 25px khoảng cách) */
  }

  /* 2. Ép menu bên phải chiếm đúng 50% chiều ngang */
  .navbar-nav.ms-auto {
    margin-left: 0 !important;    /* Xóa bỏ margin mặc định của Bootstrap */
    flex: 1;
    display: flex;
    justify-content: flex-start;  /* Đẩy các mục bên phải xuất phát từ logo đi ra */
    padding-left: 80px;           /* VÙNG CẤM ĐỊA: Né nửa cái logo bên phải */
    align-items: center;
  }

  /* 3. Vô hiệu hóa class w-100 của phần Auth trên PC để tránh phá vỡ hàng ngang */
  .auth-section .w-100 {
    width: auto !important;
  }

  .auth-section {
    flex-direction: row !important;
    gap: 10px !important;
    flex-wrap: nowrap;            /* Ép tên và nút luôn nằm trên một hàng */
  }

  .user-greeting {
    white-space: nowrap;          /* Khóa không cho chữ tên user bị tụt dòng bậy bạ */
    background: #ffffff;
    color: #1e40af;
    padding: 0.4rem 0.8rem;
  }

  /* --- GIỮ NGUYÊN PHẦN LOGO CŨ CỦA ÔNG --- */
  .navbar-brand-center {
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, -62%);
    margin: 0;
    z-index: 1050;
  }

  .nav-logo {
    width: 110px;
    height: 110px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  .nav-logo:hover {
    transform: scale(1.05);
  }

  .push-content-down {
    margin-bottom: 70px;
  }

  .nav-link {
    margin: 0 6px;
    border-radius: 8px;
  }
}

/* Hover & Active (PC) */
@media (min-width: 992px) {
  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.15) !important;
    color: #fff !important;
  }
  .nav-link.router-link-active {
    background-color: #ffffff !important;
    color: #1e40af !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
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

/* --- GIAO DIỆN MOBILE CHUẨN (XÓA SẠCH KHOẢNG HỞ) --- */
@media (max-width: 991px) {
  .custom-navbar {
    padding: 0.5rem 1rem;
  }

  .navbar-nav {
    padding-top: 0 !important;
    margin-bottom: 0 !important;
  }

  .nav-item {
    margin: 0 !important;
    padding: 0 !important;
  }

  .nav-link {
    margin: 0 !important;
    border-radius: 0 !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem !important;
    text-align: center;
  }

  .nav-link.router-link-active {
    background-color: #ffffff !important;
    color: #1e40af !important;
  }

  .auth-section {
    padding: 1rem 0 !important;
    margin: 0 !important;
    border-bottom: none;
  }
}
</style>
