<template>
  <div class="admin-members">
    <h3 class="mb-4">Danh sách Giáo viên / Nhân viên</h3>

    <div class="card mb-4 p-3 bg-light border-0 shadow-sm">
      <h5>+ Thêm thành viên mới</h5>
      <div class="d-flex gap-2 mt-2">
        <input
          v-model="newMember.name"
          type="text"
          class="form-control"
          placeholder="Tên thành viên..."
          required
        />
        <input
          v-model="newMember.role"
          type="text"
          class="form-control"
          placeholder="Vai trò (VD: Giáo viên sơn dầu)..."
          required
        />
        <input
          v-model="newMember.description"
          type="text"
          class="form-control"
          placeholder="Mô tả..."
          required
        />
        <input
          type="file"
          @change="onFileSelected"
          ref="fileInput"
          class="form-control"
          accept="image/*"
          required
        />

        <button @click="addMember" class="btn btn-primary px-4" :disabled="isUploading">
          {{ isUploading ? 'Đang up...' : 'Thêm' }}
        </button>
      </div>
    </div>

    <table class="table table-hover align-middle">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Vai trò</th>
          <th class="text-center">Mô tả</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in members" :key="member.id">
          <td>{{ member.id }}</td>
          <td class="fw-bold">{{ member.name }}</td>
          <td>
            <span class="badge bg-secondary">{{ member.role }}</span>
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-primary me-2">Sửa</button>
            <button class="btn btn-sm btn-outline-danger">Xóa</button>
          </td>
        </tr>
        <tr v-if="members.length === 0">
          <td colspan="4" class="text-center text-muted py-3">Chưa có thành viên nào</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  name: 'AdminMembers',
  data() {
    return {
      members: [],
      newMember: {
        name: '',
        role: '',
        description: '',
        image_url: '',
      },
      selectedImage: null,
      isUploading: false,
    }
  },
  async mounted() {
    await this.fetchMembers()
  },
  methods: {
    async fetchMembers() {
      // Implementation for fetching members
      const { data , errorFetch} = await supabase.from('members').select('*')
      if (errorFetch) {
        console.log('Lỗi khi kéo data từ Supabase:', errorFetch.message)
        return
      }
      if (data) {
        this.members = data.map((item) => ({
            id: item.id,
            name: item.name,
            role: item.role,
            description: item.description,
            image_url: item.image_url,
        }))
      }
    },
    async onFileSelected(event) {
        this.selectedImage = event.target.files[0]
    }
    ,
    async addMember() {
      if (
        !this.newMember.name ||
        !this.newMember.role ||
        !this.newMember.description ||
        !this.selectedImage
      ) {
        alert('Thiếu thông tin!')
        return
      } //Check if all fields are filled

      this.isUploading = true
      try {
        const fileExt = this.selectedImage.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}` //Create file name with timestamp

        const { data, uploadError } = await supabase.storage
          .from('members')
          .upload(fileName, this.selectedImage) //Upload image to Supabase Storage
        if (uploadError) {
          console.error('Lỗi upload ảnh:', uploadError.message)
          alert('Upload ảnh thất bại!')
          this.isUploading = false
          return
        }

        const { data: publicUrlData } = supabase.storage.from('members').getPublicUrl(fileName)
        this.newMember.image_url = publicUrlData.publicUrl //Get public URL of the uploaded image

        // Implementation for adding member to database
        const { data: dbData, error: dbError } = await supabase
          .from('members')
          .insert([
            {
              name: this.newMember.name,
              role: this.newMember.role,
              description: this.newMember.description,
              image_url: this.newMember.image_url,
            },
          ])
          .select()

        if (dbError) {
          console.error('Lỗi thêm thành viên:', dbError.message)
          alert('Thêm thành viên thất bại!')
          this.isUploading = false
          return
        }

        this.members.unshift(dbData[0])
        this.newMember = { name: '', role: '', description: '', image_url: '' }
        this.selectedImage = null
        this.$refs.fileInput.value = ''
        this.isUploading = false
      } catch (error) {
        console.error('Lỗi không xác định:', error)
        alert('Đã có lỗi xảy ra!')
        this.isUploading = false
      } finally {
        this.isUploading = false
      }
    },
  },
}
</script>
