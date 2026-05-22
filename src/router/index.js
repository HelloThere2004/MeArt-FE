import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/utils/supabase.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/lichhoc',
      name: 'lichhoc',
      component: () => import('../views/TimeTableView.vue'),
    },
    {
      path: '/gallery',
      name: 'Gallery',
      component: () => import('../views/GalleryView.vue'),
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
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('../views/SignUpView.vue'),
    },
    {
      path: '/posts',
      name: 'Posts',
      component: () => import('../views/PostView.vue'),
    },
    {
      path: '/:catchAll(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})
router.beforeEach(async (to, from, next) => {
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
