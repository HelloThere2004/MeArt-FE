<template>
  <div class="container">
    <h2>Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</h2>
    <router-link to="/">Về lại trang chủ</router-link>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
export default {}
</script>

<style>
h2 {
  text-align: center;
  margin-top: 20px;
  color: #1e40af;
  font-weight: bold;
}
a {
  display: block;
  text-align: center;
  margin-top: 20px;
  font-size: 20px;
  color: #1e40af;
  text-decoration: none;
  font-weight: bold;
}
a:hover {
  color: #173285;
  text-decoration: underline;
}

@media (max-width: 480px) {
  h2 {
    font-size: 18px;
    margin-top: 15px;
    padding: 0 15px;
  }
  a {
    font-size: 16px;
  }
}
</style>
