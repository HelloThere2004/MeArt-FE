<template>
  <div class="container time-table">
    <div class="info">
        <h1>Đây là lịch học của lớp vẽ Mê Art</h1>
        <p>Lớp Mê Art của chúng tôi hoạt động xuyên suốt tuần. Dựa vào số lượng học sinh, chúng tôi có thể mở thêm hoặc bớt lại các giờ học.</p>
        <p>Hiện tại, giờ học của lớp như sau: </p>
    </div>
    
    <div class="table-responsive">
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
          <tr>
            <td class="learn-time">8h - 12h</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="table-success"><img src="../assets/image/timetable/drawIcon.png" alt="Lớp hoạt động" /></td>
            <td class="table-success"><img src="../assets/image/timetable/drawIcon.png" alt="Lớp hoạt động" /></td>
          </tr>
          <tr>
            <td class="learn-time">14h - 18h</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="table-success"><img src="../assets/image/timetable/drawIcon.png" alt="Lớp hoạt động" /></td>
            <td></td>
          </tr>
          <tr>
            <td class="learn-time">18h - 21h</td>
            <td></td>
            <td></td>
            <td></td>
            <td class="table-success"><img src="../assets/image/timetable/drawIcon.png" alt="Lớp hoạt động" /></td>
            <td class="table-success"><img src="../assets/image/timetable/drawIcon.png" alt="Lớp hoạt động" /></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
export default {}
</script>

<style>
.time-table {
  margin: 20px auto;
  padding: 20px;
  background-color:  #fffc;
  border-radius: 4px;
  max-width: 90%;
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

.table-success {
  background-color: #b2fab4 !important;
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

.table th {
  background-color: #f9ec9c;
  font-weight: bold;
  color: #333;
}

.table td img {
  width: 40px;
  height: 40px;
  display: block;
  margin: 0 auto;
}

.learn-time {
  font-weight: bold;
  white-space: normal !important; 
  word-break: break-word;         
  overflow-wrap: break-word;      
  max-width: 40px;
  font-size: 11px;
  line-height: 1.1;
  color: #333333;
}

@media (max-width: 480px) {
  .table th,
  .table td {
    font-size: 11px;
    padding: 4px;
  }

  .table td img {
    width: 20px;
    height: 20px;
  }

  .learn-time {
    font-size: 10px;
    padding: 2px;
    text-align: left;
  }
  

}
</style>
