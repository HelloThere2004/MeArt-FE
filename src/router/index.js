import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/utils/supabase.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: 'Trang Chủ - Mê Art | Học Vẽ Tự Do & Luyện Thi Đại Học Kiến Trúc, Mỹ Thuật' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'Về Mê Art - Không Gian Sáng Tạo & Truyền Cảm Hứng Nghệ Thuật' }
    },
    {
      path: '/lichhoc',
      name: 'lichhoc',
      component: () => import('../views/TimeTableView.vue'),
      meta: { title: 'Lịch Học - Mê Art | Các Lớp Học Vẽ Tự Do & Luyện Thi' }
    },
    {
      path: '/gallery',
      name: 'Gallery',
      component: () => import('../views/GalleryView.vue'),
      meta: { title: 'Thư Viện Tranh - Các Tác Phẩm Mỹ Thuật Nổi Bật Của Học Viên' }
    },
    {
      path: '/index.html',
      redirect: '/',
    },
    {
      path: '/index',
      redirect: '/',
    },
    {
      path: '/admin',
      name: 'Administration',
      component: () => import('../views/AdministrationView.vue'),
      // Giữ nguyên requiresAuth, nạp thêm title
      meta: { requiresAuth: true, title: 'Quản Trị Hệ Thống - Mê Art' },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Đăng Nhập - Mê Art' }
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('../views/SignUpView.vue'),
      meta: { title: 'Đăng Ký Tài Khoản - Mê Art' }
    },
    {
      path: '/posts',
      name: 'Posts',
      component: () => import('../views/PostView.vue'),
      meta: { title: 'Tin Tức & Bài Viết Chia Sẻ Kinh Nghiệm Vẽ - Mê Art' }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterFormView.vue'),
      meta: { title: 'Đăng Ký Tư Vấn & Học Thử - Mê Art Class' }
    },
    {
      path: '/outstanding-students', 
      name: 'OutstandingStudents',
      component: () => import('../views/OutstandingStudentView.vue'),
      meta: { title: 'Học Viên Tiêu Biểu - Niềm Tự Hào Của Mê Art' }
    },
    {
      path: '/:catchAll(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: 'Không Tìm Thấy Trang - Mê Art' }
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  // ĐỘNG THÁI SEO: Đổi title cho tab trình duyệt ngay khi nhảy trang
  document.title = to.meta.title || 'Mê Art Class | Không Gian Mỹ Thuật Sáng Tạo'

  const { data } = await supabase.auth.getSession()
  const isAuthenticated = !!data.session // Đã sửa lỗi số 2

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Administration' }) // Đã sửa lỗi số 3
  } else {
    next()
  }
})

export default router