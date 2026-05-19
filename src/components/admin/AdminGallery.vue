<template>
  <div class="admin-gallery">
    <h3 class="mb-4">Quản lý Tác phẩm (Gallery)</h3>

    <div class="card mb-4 p-3 bg-light border-0 shadow-sm">
      <h5>+ Đăng tác phẩm mới</h5>
      <div class="d-flex gap-2 mt-2">
        <input v-model="newItem.title" type="text" class="form-control" placeholder="Tên tác phẩm..." required />
        <input v-model="newItem.author" type="text" class="form-control" placeholder="Tên tác giả / Học viên..." required />
        <input type="file" @change="onFileSelected" ref="fileInput" class="form-control" accept="image/*" required />
        <button @click="addArtwork" class="btn btn-success px-4" :disabled="isUploading">
          {{ isUploading ? 'Đang up...' : 'Thêm' }}
        </button>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-md-3" v-for="art in gallery" :key="art.id">
        <div class="card h-100 shadow-sm">
          <img :src="art.image_url" class="card-img-top" style="height: 200px; object-fit: cover;" alt="Artwork">
          <div class="card-body text-center">
            <h6 class="card-title fw-bold mb-1">{{ art.title }}</h6>
            <p class="card-text text-muted small mb-3">Bởi: {{ art.author }}</p>
            <button class="btn btn-sm btn-outline-danger w-100" @click="deleteArtwork(art.id, art.image_url)">Xóa tác phẩm</button>
          </div>
        </div>
      </div>
      <div v-if="gallery.length === 0" class="col-12 text-center text-muted mt-4">
        Chưa có tác phẩm nào trong Gallery.
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabase.js'

export default {
  name: 'AdminGallery',
  data() {
    return {
      gallery: [],
      newItem: { title: '', author: '', image_url: '' },
      selectedImage: null,
      isUploading: false,
    }
  },
  async mounted() {
    await this.fetchGallery()
  },
  methods: {
    async fetchGallery() {
      const { data, error } = await supabase.from('gallery').select('*').order('id', { ascending: false })
      if (!error) this.gallery = data || []
    },
    onFileSelected(event) {
      this.selectedImage = event.target.files[0]
    },
    async addArtwork() {
      if (!this.newItem.title || !this.newItem.author || !this.selectedImage) {
        alert('Vui lòng điền đủ thông tin!')
        return
      }

      this.isUploading = true
      try {
        const fileExt = this.selectedImage.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`

        // Cần tạo bucket 'gallery' trên Supabase nhé sếp
        const { uploadError } = await supabase.storage.from('gallery').upload(fileName, this.selectedImage)
        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(fileName)
        
        const { data: dbData, error: dbError } = await supabase.from('gallery').insert([
          {
            title: this.newItem.title,
            author: this.newItem.author,
            image_url: publicUrlData.publicUrl,
          }
        ]).select()

        if (dbError) throw dbError

        this.gallery.unshift(dbData[0])
        this.newItem = { title: '', author: '', image_url: '' }
        this.selectedImage = null
        this.$refs.fileInput.value = ''
      } catch (error) {
        console.error(error.message)
      } finally {
        this.isUploading = false
      }
    },
    async deleteArtwork(id, imageUrl) {
      if (!confirm('Xóa tác phẩm này?')) return
      try {
        await supabase.from('gallery').delete().eq('id', id)
        if (imageUrl) {
          const fileName = imageUrl.split('/').pop()
          await supabase.storage.from('gallery').remove([fileName])
        }
        this.gallery = this.gallery.filter(item => item.id !== id)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>