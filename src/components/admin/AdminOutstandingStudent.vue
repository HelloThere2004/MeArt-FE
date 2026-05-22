<template>
  <div class="admin-outstanding">
    <h3 class="mb-4">Quản lý Học Sinh Ưu Tú</h3>

    <div class="card mb-4 p-4 bg-light border-0 shadow-sm">
      <h5 class="mb-3">+ Thêm Gương Mặt Mới</h5>
      <form @submit.prevent="addStudent" class="row g-3">
        <div class="col-md-6">
          <input v-model="newStudent.student_name" type="text" class="form-control" placeholder="Tên học sinh..." required />
        </div>
        <div class="col-md-6">
          <input v-model="newStudent.achievement" type="text" class="form-control" placeholder="Thành tích (VD: Thủ khoa Kiến Trúc)..." required />
        </div>
        <div class="col-12">
          <textarea v-model="newStudent.content" class="form-control" rows="3" placeholder="Đôi lời cảm nhận hoặc quá trình học tập..." required></textarea>
        </div>
        <div class="col-md-8">
          <input type="file" @change="onFileSelected" ref="fileInput" class="form-control" accept="image/*" required />
        </div>
        <div class="col-md-4">
          <button type="submit" class="btn btn-warning w-100 fw-bold" :disabled="isUploading">
            <span v-if="isUploading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isUploading ? 'Đang tải lên...' : 'Đăng Bài' }}
          </button>
        </div>
      </form>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle bg-white shadow-sm" style="table-layout: fixed; width: 100%;">
        <thead class="table-dark">
          <tr>
            <th style="width: 15%;">Ảnh</th>
            <th style="width: 20%;">Học sinh</th>
            <th style="width: 20%;">Thành tích</th>
            <th style="width: 35%;">Nội dung</th>
            <th style="width: 10%; text-align: center;">Xóa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>
              <img :src="student.image_url" alt="Hình học sinh" class="img-thumbnail" style="width: 80px; height: 80px; object-fit: cover;" />
            </td>
            <td class="fw-bold">{{ student.student_name }}</td>
            <td><span class="badge bg-success">{{ student.achievement }}</span></td>
            <td style="white-space: normal; word-wrap: break-word;">{{ student.content }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-danger" @click="deleteStudent(student.id, student.image_url)">
                <i class="bi bi-trash"></i> Xóa
              </button>
            </td>
          </tr>
          <tr v-if="students.length === 0">
            <td colspan="5" class="text-center py-4 text-muted">Chưa có học sinh ưu tú nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabase.js'

export default {
  name: 'AdminOutstandingStudent',
  data() {
    return {
      students: [],
      newStudent: { student_name: '', achievement: '', content: '', image_url: '' },
      selectedImage: null,
      isUploading: false,
    }
  },
  async mounted() {
    await this.fetchStudents()
  },
  methods: {
    async fetchStudents() {
      const { data, error } = await supabase.from('outstandingStudent').select('*').order('created_at', { ascending: false })
      if (!error) this.students = data || []
    },
    onFileSelected(event) {
      this.selectedImage = event.target.files[0]
    },
    async addStudent() {
      if (!this.selectedImage) return alert('Nhớ chọn ảnh nha sếp!')
      this.isUploading = true
      
      try {
        const fileExt = this.selectedImage.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from('outstandingStudent').upload(fileName, this.selectedImage)
        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage.from('outstandingStudent').getPublicUrl(fileName)

        const { data: dbData, error: dbError } = await supabase.from('outstandingStudent').insert([{
          student_name: this.newStudent.student_name,
          achievement: this.newStudent.achievement,
          content: this.newStudent.content,
          image_url: publicUrlData.publicUrl
        }]).select()

        if (dbError) throw dbError

        this.students.unshift(dbData[0])
        this.newStudent = { student_name: '', achievement: '', content: '', image_url: '' }
        this.selectedImage = null
        this.$refs.fileInput.value = ''
      } catch (error) {
        alert('Lỗi: ' + error.message)
      } finally {
        this.isUploading = false
      }
    },
    async deleteStudent(id, imageUrl) {
      if (!confirm('Xóa thông tin này?')) return
      try {
        await supabase.from('outstandingStudent').delete().eq('id', id)
        if (imageUrl) {
          const fileName = imageUrl.split('/').pop()
          await supabase.storage.from('outstandingStudent').remove([fileName])
        }
        this.students = this.students.filter(s => s.id !== id)
      } catch (error) {
        alert('Xóa thất bại!')
      }
    }
  }
}
</script>