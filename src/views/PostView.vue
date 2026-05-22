<template>
  <div class="post-view">
    <div class="container">
      <div class="text-center mb-4">
        <h1>Bài Viết & Tin Tức</h1>
        <p class="text-muted">Cập nhật những thông tin mới nhất từ lớp vẽ Mê Art</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="posts.length === 0" class="text-center py-5 text-muted">
        <p>Chưa có bài viết nào.</p>
      </div>

      <!-- Post cards: vertical feed layout -->
      <div v-else class="post-feed">
        <Post
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @read-more="openModal"
          class="mb-4"
        />
      </div>
    </div>

    <!-- SINGLE shared modal (outside the loop) -->
    <div
      v-if="selectedPost"
      class="modal fade"
      id="postDetailModal"
      tabindex="-1"
      aria-labelledby="postDetailModalLabel"
      aria-hidden="true"
      ref="postModal"
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
              v-if="selectedPost.image_url"
              :src="selectedPost.image_url"
              :alt="selectedPost.title"
              class="img-fluid rounded mb-3 w-100 modal-cover"
            />
            <small class="text-muted d-block mb-3">
              {{ formatDate(selectedPost.published_at || selectedPost.created_at) }}
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
import { Modal } from 'bootstrap'
import Post from '@/components/Post.vue'
import { supabase } from '@/utils/supabase.js'

export default {
  name: 'PostView',
  components: {
    Post,
  },
  data() {
    return {
      posts: [],
      selectedPost: null,
      loading: true,
      modalInstance: null,
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
        .eq('is_published', true)
        .order('published_at', { ascending: false })

      if (error) {
        console.error('Lỗi khi tải bài viết:', error.message)
      } else {
        this.posts = data || []
      }
      this.loading = false
    },
    openModal(post) {
      this.selectedPost = post
      // Wait for Vue to render the modal, then show it
      this.$nextTick(() => {
        const modalEl = this.$refs.postModal
        if (modalEl) {
          this.modalInstance = new Modal(modalEl)
          this.modalInstance.show()
        }
      })
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    formatContent(content) {
      if (!content) return ''
      // Split by double newlines to form paragraphs
      return content
        .split(/\n\s*\n/)
        .map((para) => para.trim())
        .filter((para) => para.length > 0)
        .map((para) => `<p>${para.replace(/\n/g, '<br>')}</p>`)
        .join('')
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

.post-feed {
  max-width: 900px;
  margin: 0 auto;
}

.modal-cover {
  max-height: 400px;
  object-fit: cover;
}

.post-content {
  line-height: 1.7;
  font-size: 16px;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-word;
}

.post-content :deep(p) {
  margin-bottom: 1rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .post-view {
    padding: 15px 0;
  }

  .post-view h1 {
    font-size: 22px;
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
}
</style>
