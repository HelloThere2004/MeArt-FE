<template>
  <div class="admin-container d-flex">
    
    <div class="sidebar p-3 bg-light d-flex flex-column" style="width: 250px; min-height: 100vh;">
      <h3 class="mb-4">Admin Mê Art</h3>
      
      <div class="list-group flex-grow-1">
        <button 
          class="list-group-item list-group-item-action"
          :class="{ active: currentTab === 'members' }"
          @click="currentTab = 'members'"
        >
          Quản lý Thành viên
        </button>

        <button 
          class="list-group-item list-group-item-action"
          :class="{ active: currentTab === 'posts' }"
          @click="currentTab = 'posts'"
        >
          Đăng Bài Viết
        </button>

        <button 
          class="list-group-item list-group-item-action"
          :class="{ active: currentTab === 'gallery' }"
          @click="currentTab = 'gallery'"
        >
          Quản lý Gallery
        </button>
      </div>

      <div class="mt-auto pt-3 border-top">
        <button @click="handleLogout" class="btn btn-outline-danger w-100 fw-bold">
          Đăng xuất
        </button>
      </div>
    </div>

    <div class="content flex-grow-1 p-4">
      <component :is="activeComponent"></component>
    </div>

  </div>
</template>

<script>
import AdminMembers from '../components/admin/AdminMembers.vue'
import AdminPosts from '../components/admin/AdminPosts.vue'
import AdminGallery from '../components/admin/AdminGallery.vue'
import { supabase } from '@/utils/supabase.js' 

export default {
  name: 'AdminView',
  components: {
    AdminMembers,
    AdminPosts,
    AdminGallery
  },
  data() {
    return {
      currentTab: 'members'
    }
  },
  computed: {
    activeComponent() {
      if (this.currentTab === 'members') return 'AdminMembers'
      if (this.currentTab === 'posts') return 'AdminPosts'
      if (this.currentTab === 'gallery') return 'AdminGallery'
    }
  },
  methods: {
    // Hàm xử lý đăng xuất
    async handleLogout() {
      // Hỏi lại cho chắc ăn, tránh bấm nhầm
      if (!confirm('Sếp muốn đăng xuất khỏi hệ thống?')) return;

      // Gọi API đăng xuất của Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        alert('Lỗi đăng xuất: ' + error.message);
      } else {
        // Đăng xuất thành công thì đá văng ra ngoài trang Login
        this.$router.push('/login');
      }
    }
  }
}
</script>