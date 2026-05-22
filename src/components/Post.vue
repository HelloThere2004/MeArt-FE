<template>
  <div class="card shadow-sm post-card">
    <div class="row g-0">
      <!-- Image column -->
      <div class="col-md-4" v-if="post.image_url">
        <img :src="post.image_url" :alt="post.title" class="img-fluid post-cover" />
      </div>
      <!-- Content column -->
      <div :class="post.image_url ? 'col-md-8' : 'col-12'">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold">{{ post.title }}</h5>
          <small class="text-muted mb-3">
            {{ formatDate(post.published_at || post.created_at) }}
          </small>
          <p class="card-text text-muted flex-grow-1">
            {{ getExcerpt(post.content) }}
          </p>
          <button
            class="btn btn-outline-dark btn-sm mt-2 align-self-start"
            @click="$emit('read-more', post)"
          >
            Đọc thêm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

export default {
  name: 'PostComponent',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  emits: ['read-more'],
  methods: {
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
      const plain = content.replace(/<[^>]*>/g, '')
      return plain.length > 150 ? plain.substring(0, 150) + '...' : plain
    },
  },
}
</script>

<style scoped>
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
  width: 100%;
  height: 100%;
  min-height: 220px;
  object-fit: cover;
}

.card-body {
  padding: 1.5rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .post-cover {
    min-height: 200px;
    max-height: 300px;
  }

  .card-title {
    font-size: 17px;
  }

  .card-text {
    font-size: 14px;
  }

  .card-body {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .post-cover {
    min-height: 180px;
    max-height: 240px;
  }

  .card-title {
    font-size: 16px;
  }
}
</style>
