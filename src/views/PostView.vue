<template>
  <div class="post-view">
    <div class="container">
      <div class="text-center mb-4">
        <h1>Bài Viết & Tin Tức</h1>
        <p class="text-muted">Cập nhật những thông tin mới nhất từ lớp vẽ Mê Art</p>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>

      <div v-else-if="posts.length === 0" class="text-center py-5 text-muted">
        <p>Chưa có bài viết nào.</p>
      </div>

      <div v-else class="row g-4">
        <div class="col-md-6 col-lg-4" v-for="post in posts" :key="post.id">
          <div class="card h-100 shadow-sm post-card">
            <img
              v-if="post.cover_image"
              :src="post.cover_image"
              :alt="post.title"
              class="card-img-top post-cover"
            />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold">{{ post.title }}</h5>
              <small class="text-muted mb-2">
                {{ formatDate(post.created_at) }}
              </small>
              <p class="card-text text-muted flex-grow-1">
                {{ getExcerpt(post.content) }}
              </p>
              <button
                class="btn btn-outline-dark btn-sm mt-2 align-self-start"
                @click="selectedPost = post"
                data-bs-toggle="modal"
                data-bs-target="#postDetailModal"
              >
                Đọc thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Detail Modal -->
    <div
      class="modal fade"
      id="postDetailModal"
      tabindex="-1"
      aria-labelledby="postDetailModalLabel"
      aria-hidden="true"
      v-if="selectedPost"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold" id="postDetailModalLabel">
              {{ selectedPost.title }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <img
              v-if="selectedPost.cover_image"
              :src="selectedPost.cover_image"
              :alt="selectedPost.title"
              class="img-fluid rounded mb-3 w-100 modal-cover"
            />
            <small class="text-muted d-block mb-3">
              {{ formatDate(selectedPost.created_at) }}
            </small>
            <div class="post-content" v-html="formatContent(selectedPost.content)"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { supabase } from '@/utils/supabase.js'

export default {
  name: 'PostView',
  data() {
    return {
      posts: [],
      selectedPost: null,
      loading: true,
    }
  },
  async mounted() {
    await this.fetchPosts()
  },
  methods: {
    async fetchPosts() {
      this.loading = true
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Lỗi khi tải bài viết:', error.message)
      } else {
        this.posts = data || []
      }
      this.loading = false
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    getExcerpt(content) {
      if (!content) return ''
      // Strip HTML tags and limit to ~150 chars
      const plain = content.replace(/<[^>]*>/g, '')
      return plain.length > 150 ? plain.substring(0, 150) + '...' : plain
    },
    formatContent(content) {
      if (!content) return ''
      // Convert newlines to <br> for display
      return content.replace(/\n/g, '<br>')
    },
  },
}
</script>

<style scoped>
.post-view {
  padding: 30px 0;
  min-height: 70vh;
  background-color: #f8f9fa;
}

.post-view h1 {
  font-size: 32px;
  color: rgb(120, 110, 0);
  font-weight: bold;
}

.post-card {
  border: none;
  border-radius: 12px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  overflow: hidden;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
}

.post-cover {
  height: 200px;
  object-fit: cover;
}

.modal-cover {
  max-height: 400px;
  object-fit: cover;
}

.post-content {
  line-height: 1.7;
  font-size: 16px;
  white-space: pre-line;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .post-view {
    padding: 15px 0;
  }

  .post-view h1 {
    font-size: 22px;
  }

  .post-cover {
    height: 180px;
  }

  .card-title {
    font-size: 16px;
  }

  .card-text {
    font-size: 14px;
  }

  .modal-dialog {
    margin: 0.5rem;
    max-width: calc(100% - 1rem);
  }

  .modal-cover {
    max-height: 250px;
  }

  .post-content {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .post-view h1 {
    font-size: 20px;
  }

  .post-cover {
    height: 160px;
  }
}
</style>
