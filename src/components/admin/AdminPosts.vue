<template>
  <div class="admin-posts">
    <h3 class="mb-4">Đăng Bài Viết / Tin Tức</h3>

    <div class="card mb-4 p-4 bg-light border-0 shadow-sm">
      <h5 v-if="!isEditing">+ Thêm bài viết mới</h5>
      <h5 v-else>✏️ Chỉnh sửa bài viết</h5>
      <div class="mb-3">
        <label class="form-label fw-bold">Tiêu đề bài viết</label>
        <input
          v-model="newPost.title"
          type="text"
          class="form-control"
          placeholder="Nhập tiêu đề..."
          required
        />
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Ảnh bìa (Cover Image)</label>
        <input
          type="file"
          @change="onFileSelected"
          ref="fileInput"
          class="form-control"
          accept="image/*"
        />
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Nội dung</label>
        <textarea
          v-model="newPost.content"
          class="form-control"
          rows="5"
          placeholder="Nội dung chi tiết..."
        ></textarea>
      </div>
      <div class="mb-3 form-check">
        <input
          v-model="newPost.is_published"
          type="checkbox"
          class="form-check-input"
          id="publishCheck"
        />
        <label class="form-check-label" for="publishCheck"> Xuất bản ngay </label>
      </div>
      <div class="d-flex gap-2">
        <button v-if="!isEditing" @click="addPost" class="btn btn-primary" :disabled="isUploading">
          {{ isUploading ? 'Đang xử lý...' : 'Xuất bản bài viết' }}
        </button>
        <button v-else @click="updatePost" class="btn btn-success" :disabled="isUploading">
          {{ isUploading ? 'Đang xử lý...' : 'Cập nhật bài viết' }}
        </button>
        <button
          v-if="isEditing"
          @click="cancelEdit"
          class="btn btn-outline-secondary"
          :disabled="isUploading"
        >
          Hủy
        </button>
      </div>
    </div>

    <h5 class="mb-3">Bài viết gần đây</h5>
    <div class="list-group">
      <div
        v-for="post in posts"
        :key="post.id"
        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
      >
        <div class="d-flex align-items-center gap-3">
          <img
            v-if="post.image_url"
            :src="post.image_url"
            alt="cover"
            style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px"
          />
          <div>
            <h6 class="mb-1 fw-bold">{{ post.title }}</h6>
            <small class="text-muted">{{
              new Date(post.created_at).toLocaleDateString('vi-VN')
            }}</small>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" @click="startEdit(post)">Sửa</button>
          <button
            class="btn btn-sm btn-outline-danger"
            @click="deletePost(post.id, post.image_url)"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabase.js'

export default {
  name: 'AdminPosts',
  data() {
    return {
      posts: [],
      newPost: { title: '', content: '', image_url: '', is_published: true },
      selectedImage: null,
      isUploading: false,
      editingPost: null,
      isEditing: false,
    }
  },
  async mounted() {
    await this.fetchPosts()
  },
  methods: {
    async fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) this.posts = data || []
    },
    onFileSelected(event) {
      this.selectedImage = event.target.files[0]
    },
    startEdit(post) {
      this.isEditing = true
      this.editingPost = post
      this.newPost = {
        title: post.title,
        content: post.content,
        image_url: post.image_url || '',
        is_published: post.is_published ?? true,
      }
      this.selectedImage = null
      if (this.$refs.fileInput) this.$refs.fileInput.value = ''
    },
    cancelEdit() {
      this.isEditing = false
      this.editingPost = null
      this.newPost = { title: '', content: '', image_url: '', is_published: true }
      this.selectedImage = null
      if (this.$refs.fileInput) this.$refs.fileInput.value = ''
    },
    async updatePost() {
      if (!this.newPost.title || !this.newPost.content) {
        alert('Thiếu tiêu đề hoặc nội dung!')
        return
      }

      this.isUploading = true
      let coverUrl = this.newPost.image_url || ''

      try {
        // If a new image was selected, upload it
        if (this.selectedImage) {
          // Delete old image if exists
          if (this.newPost.image_url) {
            const oldFileName = this.newPost.image_url.split('/').pop()
            await supabase.storage.from('posts').remove([oldFileName])
          }

          const fileExt = this.selectedImage.name.split('.').pop()
          const fileName = `${Date.now()}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(fileName, this.selectedImage)
          if (uploadError) {
            console.error('Upload error:', uploadError.message)
            alert('Lỗi upload ảnh: ' + uploadError.message)
            this.isUploading = false
            return
          }

          const { data } = supabase.storage.from('posts').getPublicUrl(fileName)
          coverUrl = data.publicUrl
        }

        const updateData = {
          title: this.newPost.title,
          content: this.newPost.content,
          image_url: coverUrl || null,
          is_published: this.newPost.is_published,
          published_at: this.newPost.is_published ? new Date().toISOString() : null,
        }

        const { data: dbData, error: dbError } = await supabase
          .from('posts')
          .update(updateData)
          .eq('id', this.editingPost.id)
          .select()

        if (dbError) {
          console.error('DB error:', dbError.message)
          alert('Lỗi cập nhật bài viết: ' + dbError.message)
          this.isUploading = false
          return
        }

        // Replace the old post in the list with the updated one
        const idx = this.posts.findIndex((p) => p.id === this.editingPost.id)
        if (idx !== -1 && dbData[0]) {
          this.posts.splice(idx, 1, dbData[0])
        }

        this.cancelEdit()
      } catch (error) {
        console.error('Lỗi:', error.message)
        alert('Có lỗi xảy ra: ' + error.message)
      } finally {
        this.isUploading = false
      }
    },
    async addPost() {
      if (!this.newPost.title || !this.newPost.content) {
        alert('Thiếu tiêu đề hoặc nội dung!')
        return
      }

      this.isUploading = true
      let coverUrl = ''

      try {
        if (this.selectedImage) {
          const fileExt = this.selectedImage.name.split('.').pop()
          const fileName = `${Date.now()}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(fileName, this.selectedImage)
          if (uploadError) {
            console.error('Upload error:', uploadError.message)
            alert(
              'Lỗi upload ảnh: ' +
                uploadError.message +
                '. Kiểm tra bucket "posts" đã tồn tại và có policy cho phép upload chưa?',
            )
            this.isUploading = false
            return
          }

          const { data } = supabase.storage.from('posts').getPublicUrl(fileName)
          coverUrl = data.publicUrl
        }

        const postData = {
          title: this.newPost.title,
          content: this.newPost.content,
          image_url: coverUrl || null,
          is_published: this.newPost.is_published,
          published_at: this.newPost.is_published ? new Date().toISOString() : null,
        }

        const { data: dbData, error: dbError } = await supabase
          .from('posts')
          .insert([postData])
          .select()

        if (dbError) {
          console.error('DB error:', dbError.message)
          alert('Lỗi lưu bài viết: ' + dbError.message)
          this.isUploading = false
          return
        }

        this.posts.unshift(dbData[0])
        this.newPost = { title: '', content: '', image_url: '', is_published: true }
        this.selectedImage = null
        if (this.$refs.fileInput) this.$refs.fileInput.value = ''
      } catch (error) {
        console.error('Lỗi:', error.message)
        alert('Có lỗi xảy ra: ' + error.message)
      } finally {
        this.isUploading = false
      }
    },
    async deletePost(id, imageUrl) {
      if (!confirm('Xóa bài viết này?')) return
      try {
        const { error: dbError } = await supabase.from('posts').delete().eq('id', id)
        if (dbError) {
          alert('Lỗi xóa bài viết: ' + dbError.message)
          return
        }
        if (imageUrl) {
          const fileName = imageUrl.split('/').pop()
          await supabase.storage.from('posts').remove([fileName])
        }
        this.posts = this.posts.filter((p) => p.id !== id)
      } catch (error) {
        console.error('Lỗi xóa:', error.message)
        alert('Xóa thất bại!')
      }
    },
  },
}
</script>

<style scoped>
.admin-posts {
  max-width: 100%;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .card.p-4 {
    padding: 1rem !important;
  }

  .card .form-control,
  .card textarea {
    font-size: 15px;
    padding: 10px 12px;
  }

  .card .btn {
    width: 100%;
    padding: 10px;
    font-size: 15px;
  }

  .list-group-item {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 10px;
    padding: 12px;
  }

  .list-group-item img {
    width: 100% !important;
    height: auto !important;
    max-height: 160px;
    object-fit: cover;
  }

  .list-group-item .btn {
    width: 100%;
  }

  .list-group-item .d-flex.gap-2 {
    width: 100%;
  }

  .list-group-item .d-flex.gap-2 .btn {
    flex: 1;
  }

  .list-group-item h6 {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .admin-posts h3 {
    font-size: 18px;
  }

  .admin-posts h5 {
    font-size: 15px;
  }

  .card.p-4 {
    padding: 0.75rem !important;
  }

  .card .form-control,
  .card textarea {
    font-size: 14px;
    padding: 8px 10px;
  }

  .card .btn {
    font-size: 14px;
    padding: 8px;
  }

  .list-group-item {
    padding: 10px;
  }

  .list-group-item h6 {
    font-size: 14px;
  }
}
</style>
