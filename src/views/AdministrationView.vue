<template>
  <div class="admin-container d-flex">
    
    <div class="sidebar p-3 bg-light" style="width: 250px; min-height: 100vh;">
      <h3 class="mb-4">Admin Mê Art</h3>
      <div class="list-group">
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
    </div>

    <div class="content flex-grow-1 p-4">
      <component :is="activeComponent"></component>
    </div>

  </div>
</template>

<script>
// Import 3 cái vỏ component vào
import AdminMembers from '../components/admin/AdminMembers.vue'
import AdminPosts from '../components/admin/AdminPosts.vue'
import AdminGallery from '../components/admin/AdminGallery.vue'

export default {
  name: 'AdminView',
  components: {
    AdminMembers,
    AdminPosts,
    AdminGallery
  },
  data() {
    return {
      // Mặc định vô Admin sẽ mở tab quản lý thành viên trước
      currentTab: 'members'
    }
  },
  computed: {
    // Thằng computed này sẽ theo dõi biến currentTab để quyết định render Component nào
    activeComponent() {
      if (this.currentTab === 'members') return 'AdminMembers'
      if (this.currentTab === 'posts') return 'AdminPosts'
      if (this.currentTab === 'gallery') return 'AdminGallery'
    }
  }
}
</script>