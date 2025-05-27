<template>
  <nav class="navigation container-fluid">
    <img src="../assets/image/logo.jpg" alt="MeArt Logo" class="img-fluid" />
    <RouterLink to="/">Trang chủ</RouterLink>
    <RouterLink to="/about">Về chúng tôi</RouterLink>
    <RouterLink to="/lichhoc">Lịch học</RouterLink>
    <RouterLink to="/gallery">Tác phẩm</RouterLink>
  </nav>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { RouterLink } from 'vue-router'
export default {
  name: 'Nav',
  components: {
    RouterLink,
  },
  data() {
    return {
      // Define any data properties here if needed
    }
  },
  methods: {
    // Define any methods here if needed
  },
}
</script>

<style>
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 20px;
  background-color: #ffea61;
  flex-wrap: wrap;
  padding: 0 10px; 
}

.navigation img {
  width: 5%;
}

.navigation a {
  text-decoration: none;
  color: #333;
  font-size: 20px;
  font-weight: bold;
  padding: 5px 5px;
  border-radius: 5px;
}

.navigation a.router-link-active,
.navigation a:hover {
  background-color: #333;
  color: #ffea61;
}

@media (max-width: 768px) {

    .navigation {
        padding: 20px 10px;
    }

    .navigation img {
        width: 10%;
    }
}

@media (max-width: 480px) {
    .navigation a {
        font-size: 14px;
    }
    .navigation {
        padding: 20px 10px;
    }

    .navigation img {
        width: 10%;
    }
}
</style>
