<template>
  <div class="admin-timetable">
    <h3 class="mb-4">Quản lý Lịch học</h3>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <div v-else class="card p-4 bg-light border-0 shadow-sm">
      <p class="text-muted mb-3">
        Tick vào các ô bên dưới để mở lớp, bỏ tick để đóng lớp. Sau đó bấm "Lưu thay đổi".
      </p>
      
      <div class="table-responsive">
        <table class="table table-bordered text-center align-middle bg-white">
          <thead class="table-warning">
            <tr>
              <th>Ca học</th>
              <th>T2</th><th>T3</th><th>T4</th><th>T5</th><th>T6</th><th>T7</th><th>CN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in schedules" :key="row.id">
              <td class="fw-bold">{{ row.time_slot }}</td>
              <td><input type="checkbox" class="form-check-input" v-model="row.t2" /></td>
              <td><input type="checkbox" class="form-check-input" v-model="row.t3" /></td>
              <td><input type="checkbox" class="form-check-input" v-model="row.t4" /></td>
              <td><input type="checkbox" class="form-check-input" v-model="row.t5" /></td>
              <td><input type="checkbox" class="form-check-input" v-model="row.t6" /></td>
              <td><input type="checkbox" class="form-check-input" v-model="row.t7" /></td>
              <td><input type="checkbox" class="form-check-input" v-model="row.cn" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <button 
        class="btn btn-primary mt-3 align-self-end" 
        @click="saveTimetable" 
        :disabled="isSaving"
      >
        <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
        {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
      </button>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabase.js'

export default {
  name: 'AdminTimeTable',
  data() {
    return {
      schedules: [],
      loading: true,
      isSaving: false,
    }
  },
  async mounted() {
    await this.fetchTimetable()
  },
  methods: {
    async fetchTimetable() {
      this.loading = true
      const { data, error } = await supabase
        .from('timetable')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Lỗi tải lịch học:', error.message)
      } else {
        this.schedules = data || []
      }
      this.loading = false
    },
    
    async saveTimetable() {
      this.isSaving = true
      try {
        // Dùng upsert để cập nhật toàn bộ mảng dữ liệu cùng lúc dựa trên ID
        const { error } = await supabase
          .from('timetable')
          .upsert(this.schedules)

        if (error) throw error
        alert('Cập nhật lịch học thành công!')
      } catch (error) {
        console.error('Lỗi lưu lịch học:', error.message)
        alert('Có lỗi xảy ra: ' + error.message)
      } finally {
        this.isSaving = false
      }
    },
  },
}
</script>

<style scoped>
.form-check-input {
  width: 1.5em;
  height: 1.5em;
  cursor: pointer;
}
</style>