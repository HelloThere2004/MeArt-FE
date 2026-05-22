<template>
  <div class="outstanding-page py-5">
    <div class="container">
      <div class="text-center mb-5">
        <h1 class="fw-bold display-5" style="color: rgb(120, 110, 0);">Niềm Tự Hào Mê Art</h1>
        <p class="text-muted lead">Cùng nhìn lại những gương mặt học viên xuất sắc và những nỗ lực không ngừng nghỉ tại lớp vẽ Mê Art.</p>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-warning" style="width: 3rem; height: 3rem;" role="status"></div>
      </div>

      <div v-else class="row g-4">
        <div class="col-lg-4 col-md-6" v-for="student in students" :key="student.id">
          <div class="card h-100 border-0 shadow-sm student-card">
            <div class="img-wrapper">
              <img :src="student.image_url" class="card-img-top" :alt="student.student_name">
            </div>
            <div class="card-body text-center p-4">
              <h4 class="card-title fw-bold mb-2">{{ student.student_name }}</h4>
              <span class="badge bg-warning text-dark px-3 py-2 mb-3 fs-6">{{ student.achievement }}</span>
              <p class="card-text text-muted fst-italic">"{{ student.content }}"</p>
            </div>
          </div>
        </div>
        
        <div v-if="students.length === 0" class="col-12 text-center text-muted py-5">
          <h4>Chưa có dữ liệu học sinh ưu tú.</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabase.js'

export default {
  name: 'OutstandingStudentView',
  data() {
    return {
      students: [],
      loading: true
    }
  },
  async mounted() {
    this.loading = true
    const { data } = await supabase
      .from('outstandingStudent')
      .select('*')
      .order('created_at', { ascending: false })
    
    this.students = data || []
    this.loading = false
  }
}
</script>

<style scoped>
.outstanding-page {
  background-color: #f8f9fa;
  min-height: 80vh;
}
.student-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.student-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
}
.img-wrapper {
  overflow: hidden;
  height: 300px;
}
.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.student-card:hover .img-wrapper img {
  transform: scale(1.05);
}
</style>