<template>
  <div class="admin-posts">
    <h3 class="mb-4">Đăng Bài Viết / Tin Tức</h3>

    <div class="card mb-4 p-4 bg-light border-0 shadow-sm">
      <div class="mb-3">
        <label class="form-label fw-bold">Tiêu đề bài viết</label>
        <input v-model="newPost.title" type="text" class="form-control" placeholder="Nhập tiêu đề..." required />
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Ảnh bìa (Cover Image)</label>
        <input type="file" @change="onFileSelected" ref="fileInput" class="form-control" accept="image/*" />
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Nội dung</label>
        <textarea v-model="newPost.content" class="form-control" rows="5" placeholder="Nội dung chi tiết..."></textarea>
      </div>
      <button @click="addPost" class="btn btn-primary" :disabled="isUploading">
        {{ isUploading ? 'Đang xử lý...' : 'Xuất bản bài viết' }}
      </button>
    </div>

    <h5 class="mb-3">Bài viết gần đây</h5>
    <div class="list-group">
      <div v-for="post in posts" :key="post.id" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <img v-if="post.cover_image" :src="post.cover_image" alt="cover" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;">
          <div>
            <h6 class="mb-1 fw-bold">{{ post.title }}</h6>
            <small class="text-muted">{{ new Date(post.created_at).toLocaleDateString('vi-VN') }}</small>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-danger" @click="deletePost(post.id, post.cover_image)">Xóa</button>
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
      newPost: { title: '', content: '', cover_image: '' },
      selectedImage: null,
      isUploading: false,
    }
  },
  async mounted() {
    await this.fetchPosts()
  },
  methods: {
    async fetchPosts() {
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
      if (!error) this.posts = data || []
    },
    onFileSelected(event) {
      this.selectedImage = event.target.files[0]
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
          // Cần tạo bucket 'posts' trên Supabase
          const fileExt = this.selectedImage.name.split('.').pop()
          const fileName = `${Date.now()}.${fileExt}`
          const { uploadError } = await supabase.storage.from('posts').upload(fileName, this.selectedImage)
          if (uploadError) throw uploadError
          const { data } = supabase.storage.from('posts').getPublicUrl(fileName)
          coverUrl = data.publicUrl
        }

        const { data: dbData, error: dbError } = await supabase.from('posts').insert([
          { title: this.newPost.title, content: this.newPost.content, cover_image: coverUrl }
        ]).select()

        if (dbError) throw dbError

        this.posts.unshift(dbData[0])
        this.newPost = { title: '', content: '', cover_image: '' }
        this.selectedImage = null
        if (this.$refs.fileInput) this.$refs.fileInput.value = ''
      } catch (error) {
        console.error(error.message)
      } finally {
        this.isUploading = false
      }
    },
    async deletePost(id, coverUrl) {
      if (!confirm('Xóa bài viết này?')) return
      try {
        await supabase.from('posts').delete().eq('id', id)
        if (coverUrl) {
          const fileName = coverUrl.split('/').pop()
          await supabase.storage.from('posts').remove([fileName])
        }
        this.posts = this.posts.filter(p => p.id !== id)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>