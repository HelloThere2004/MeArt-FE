<template>
  <div class="container time-table">
    <div class="info">
      <h1>Đây là lịch học của lớp vẽ Mê Art</h1>
      <p>
        Học viên tự chọn các buổi học phù hợp.
      </p>
      <p>Hiện tại, giờ học của lớp như sau:</p>
    </div>

    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th></th>
            <th>T2</th>
            <th>T3</th>
            <th>T4</th>
            <th>T5</th>
            <th>T6</th>
            <th>T7</th>
            <th>CN</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in schedules" :key="row.id">
            <td class="learn-time">{{ row.time_slot }}</td>

            <td :class="{ 'table-success': row.t2 }">
              <img v-if="row.t2" src="../assets/image/timetable/drawIcon2.jpg" alt="Lớp hoạt động" />
            </td>
            <td :class="{ 'table-success': row.t3 }">
              <img v-if="row.t3" src="../assets/image/timetable/drawIcon2.jpg" alt="Lớp hoạt động" />
            </td>
            <td :class="{ 'table-success': row.t4 }">
              <img v-if="row.t4" src="../assets/image/timetable/drawIcon2.jpg" alt="Lớp hoạt động" />
            </td>
            <td :class="{ 'table-success': row.t5 }">
              <img v-if="row.t5" src="../assets/image/timetable/drawIcon2.jpg" alt="Lớp hoạt động" />
            </td>
            <td :class="{ 'table-success': row.t6 }">
              <img v-if="row.t6" src="../assets/image/timetable/drawIcon2.jpg" alt="Lớp hoạt động" />
            </td>
            <td :class="{ 'table-success': row.t7 }">
              <img v-if="row.t7" src="../assets/image/timetable/drawIcon2.jpg" alt="Lớp hoạt động" />
            </td>
            <td :class="{ 'table-success': row.cn }">
              <img v-if="row.cn" src="../assets/image/timetable/drawIcon2.jpg" alt="Lớp hoạt động" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabase.js'

export default {
  data() {
    return {
      schedules: [],
      loading: true,
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
        .order('sort_order', { ascending: true }) // Sort cho đúng thứ tự giờ

      if (!error) {
        this.schedules = data || []
      } else {
        console.error('Lỗi tải lịch học:', error.message)
      }
      this.loading = false
    },
  },
}
</script>

<style>
.time-table {
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  max-width: 90%;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
}

.table-responsive {
  margin: 20px auto;
  max-width: 100%;
  color: #333333;
}

.table {
  width: 100%;
  margin: 0;
  table-layout: fixed; /* This ensures equal column widths */
  border: 1px solid #323232;
  color: #333333;
}

/* Đổi nền ô có lịch sang xanh nhạt */
.table-success {
  background-color: #dbeafe !important;
  border: 1px solid #323232;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
  font-size: 16px;
  width: calc(100% / 8); /* Divide table width by number of columns */
  height: 60px; /* Fixed height for all cells */
  padding: 10px;
  white-space: nowrap; /* Prevent text wrapping */
}

/* Đổi nền tiêu đề sang xanh lam đậm, chữ trắng */
.table th {
  background-color: #1e40af;
  font-weight: bold;
  color: #ffffff;
}

.table td img {
  width: 40px;
  height: 40px;
  display: block;
  margin: 0 auto;
}

/* Đổi màu chữ giờ học sang xanh lam */
.learn-time {
  font-weight: bold;
  white-space: normal !important;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 40px;
  font-size: 11px;
  line-height: 1.1;
  color: #1e40af;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .time-table {
    margin: 10px auto;
    padding: 12px;
    max-width: 98%;
  }

  .info h1 {
    font-size: 20px !important;
  }

  .info p {
    font-size: 14px !important;
  }

  .table th,
  .table td {
    font-size: 11px;
    padding: 4px 2px;
  }

  .table td img {
    width: 22px;
    height: 22px;
  }

  .learn-time {
    font-size: 10px;
    padding: 2px;
    max-width: 30px;
  }
}

@media (max-width: 480px) {
  .table th,
  .table td {
    font-size: 9px;
    padding: 3px 1px;
  }

  .table td img {
    width: 16px;
    height: 16px;
  }

  .learn-time {
    font-size: 8px;
    max-width: 24px;
  }
}
</style>
