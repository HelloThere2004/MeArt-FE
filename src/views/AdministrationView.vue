<template>
  <div class="admin-container d-flex flex-column flex-md-row">
    <!-- Mobile toggle button -->
    <button class="btn btn-dark d-md-none m-2" @click="sidebarOpen = !sidebarOpen">
      <i class="bi bi-list"></i> {{ sidebarOpen ? 'Đóng menu' : 'Menu Admin' }}
    </button>

    <!-- Sidebar -->
    <div
      class="sidebar p-3 bg-light"
      :class="{ 'd-none d-md-block': !sidebarOpen }"
      style="width: 250px; min-height: 100vh"
    >
      <h3 class="mb-4">Admin Mê Art</h3>
      <div class="list-group">
        <button
          class="list-group-item list-group-item-action"
          :class="{ active: currentTab === 'members' }"
          @click="switchTab('members')"
        >
          Quản lý Thành viên
        </button>

        <button
          class="list-group-item list-group-item-action"
          :class="{ active: currentTab === 'posts' }"
          @click="switchTab('posts')"
        >
          Đăng Bài Viết
        </button>

        <button
          class="list-group-item list-group-item-action"
          :class="{ active: currentTab === 'gallery' }"
          @click="switchTab('gallery')"
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
import AdminMembers from '../components/admin/AdminMembers.vue'
import AdminPosts from '../components/admin/AdminPosts.vue'
import AdminGallery from '../components/admin/AdminGallery.vue'

export default {
  name: 'AdminView',
  components: {
    AdminMembers,
    AdminPosts,
    AdminGallery,
  },
  data() {
    return {
      currentTab: 'members',
      sidebarOpen: false,
    }
  },
  computed: {
    activeComponent() {
      if (this.currentTab === 'members') return 'AdminMembers'
      if (this.currentTab === 'posts') return 'AdminPosts'
      if (this.currentTab === 'gallery') return 'AdminGallery'
    },
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab
      this.sidebarOpen = false // Auto-close sidebar on mobile after selecting
    },
  },
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.sidebar {
  border-right: 1px solid #ddd;
  flex-shrink: 0;
}

.content {
  overflow-x: hidden;
}

/* Sidebar toggle button on mobile */
.admin-container > .btn {
  align-self: flex-start;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100% !important;
    min-height: auto !important;
    padding: 1rem !important;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }

  .sidebar h3 {
    font-size: 1.3rem;
    margin-bottom: 0.75rem !important;
  }

  .list-group-item {
    padding: 0.6rem 1rem;
    font-size: 15px;
  }

  .content {
    padding: 0.75rem !important;
  }
}

@media (max-width: 480px) {
  .admin-container > .btn {
    font-size: 14px;
    padding: 8px 14px;
    margin: 8px !important;
  }

  .sidebar {
    padding: 0.75rem !important;
  }

  .list-group-item {
    font-size: 14px;
    padding: 0.5rem 0.75rem;
  }
}
</style>
