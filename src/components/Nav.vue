<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <!-- Logo -->
      <RouterLink to="/" class="navbar-brand">
        <img src="../assets/image/logo.jpg" alt="MeArt Logo" class="nav-logo" />
        <span class="brand-text">Mê Art</span>
      </RouterLink>

      <!-- Mobile Toggle -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="toggleMenu"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Nav Links -->
      <div class="collapse navbar-collapse" id="navbarNav" :class="{ show: menuOpen }">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" @click="closeMenu">Trang chủ</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link" @click="closeMenu">Về chúng tôi</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/lichhoc" class="nav-link" @click="closeMenu">Lịch học</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/gallery" class="nav-link" @click="closeMenu">Tác phẩm</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/posts" class="nav-link" @click="closeMenu">Bài viết</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/register" class="nav-link" @click="closeMenu">Đăng ký học</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/outstanding-students" class="nav-link" @click="closeMenu"
              >Học sinh ưu tú</RouterLink
            >
          </li>
        </ul>

        <!-- Auth Buttons -->
        <div class="d-flex align-items-center gap-2">
          <template v-if="isAuthenticated">
            <span class="user-greeting d-none d-md-inline">
              <i class="bi bi-person-circle me-1"></i>{{ userName }}
            </span>
            <span class="user-greeting-mobile d-md-none w-100 text-center mb-2">
              <i class="bi bi-person-circle me-1"></i>{{ userName }}
            </span>
            <RouterLink to="/admin" class="btn btn-outline-dark btn-sm">
              <i class="bi bi-speedometer2"></i> Admin
            </RouterLink>
            <button @click="handleLogout" class="btn btn-dark btn-sm">
              <i class="bi bi-box-arrow-right"></i> Đăng xuất
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="btn btn-outline-dark btn-sm">
              <i class="bi bi-box-arrow-in-right"></i> Đăng nhập
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { RouterLink } from 'vue-router'
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
    // Listen for auth state changes
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
      // Prefer user_metadata.name, fall back to email
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
.navbar {
  background: linear-gradient(135deg, #ffea61 0%, #ffd700 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.nav-logo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #333;
  transition: transform 0.3s ease;
}

.nav-logo:hover {
  transform: scale(1.1);
}

.brand-text {
  color: #333;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.nav-link {
  color: #333 !important;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin: 0 2px;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #333 !important;
  color: #ffea61 !important;
}

.btn-outline-dark {
  border: 2px solid #333;
  color: #333;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-outline-dark:hover {
  background-color: #333;
  color: #ffea61;
}

.btn-dark {
  background-color: #333;
  border: 2px solid #333;
  color: #ffea61;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-dark:hover {
  background-color: #555;
  border-color: #555;
  color: #fff;
}

.user-greeting {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-greeting-mobile {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  display: block;
}

/* Mobile & tablet responsive */
@media (max-width: 991px) {
  .navbar {
    padding: 0.4rem 0.8rem;
  }

  .navbar-nav {
    padding-top: 0.5rem;
    gap: 2px;
  }

  .nav-link {
    padding: 0.75rem 1rem !important;
    font-size: 0.95rem;
    border-radius: 6px;
  }

  .d-flex.align-items-center {
    padding-top: 0.75rem;
    padding-bottom: 0.5rem;
    flex-wrap: wrap;
    gap: 8px !important;
  }

  .d-flex.align-items-center .user-greeting-mobile {
    order: -1;
  }

  .btn-sm {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .nav-logo {
    width: 34px;
    height: 34px;
  }

  .brand-text {
    font-size: 1.15rem;
  }

  .navbar {
    padding: 0.3rem 0.5rem;
  }

  .nav-link {
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem !important;
  }
}
</style>
