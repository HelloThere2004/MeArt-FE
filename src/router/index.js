import { createRouter, createWebHistory } from 'vue-router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

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
      meta: {requiresAuth: true}
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('../views/SignUpView.vue')
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
    const isAuthenticated = !!data.user

    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: 'Login' })
    } else if (to.name === 'Login' && isAuthenticated) {
      router.push('/admin')
    } else {
      next()
    }
  })
export default router
