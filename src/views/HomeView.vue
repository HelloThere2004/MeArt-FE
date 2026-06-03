<template>
  <main class="home-wrapper">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay">
        <!-- Khung chữ ở giữa -->
        <div class="hero-content-box">
          <h1>Chào mừng đến với Mê Art</h1>
          <p>
            Nơi ươm mầm đam mê hội họa và rèn luyện kỹ năng chinh phục trường đại học mơ ước của
            bạn.
          </p>
          <!-- Đổi text-dark thành text-white cho nút xanh lam -->
          <RouterLink to="/register" class="btn btn-cta text-white"> Đăng ký học ngay </RouterLink>
        </div>
      </div>
    </section>

    <!-- Bottom Info Bar (Thanh ngang dưới) -->
    <section class="info-bar">
      <div class="container d-flex justify-content-center gap-4 flex-wrap text-center">
        <span><i class="bi bi-palette"></i> Môi trường sáng tạo</span>
        <span><i class="bi bi-calendar-check"></i> Linh hoạt lịch học</span>
        <span><i class="bi bi-heart"></i> Giao lưu kết bạn</span>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-wrapper {
  width: 100%;
}

.hero-section {
  position: relative;
  width: 100%;
  height: 80vh;
  background-image: url('../assets/image/HomePage/homeIMG1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.1);
}

.hero-content-box {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 40px 50px;
  border-radius: 8px;
  text-align: center;
  color: #333;
  max-width: 650px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.hero-content-box h1 {
  font-size: 28px;
  margin-bottom: 15px;
  font-weight: 700;
}

.hero-content-box p {
  font-size: 18px;
  margin-bottom: 25px;
  line-height: 1.5;
}

/* Đổi nút CTA thành Xanh lam */
.btn-cta {
  background-color: #1e40af;
  color: #fff !important;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 12px 30px;
  border-radius: 5px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid #1e40af;
}

.btn-cta:hover {
  background-color: #fff;
  color: #1e40af !important;
}

.info-bar {
  background-color: #1e40af;
  color: #ffffff;
  padding: 15px 0;
  font-size: 1rem;
  font-weight: 600;
}

.info-bar span {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .hero-section {
    height: 60vh;
  }
  .hero-content-box {
    padding: 30px 20px;
  }
  .hero-content-box h1 {
    font-size: 22px;
  }
  .hero-content-box p {
    font-size: 16px;
  }
  .btn-cta {
    padding: 10px 20px;
    font-size: 1rem;
  }
}
</style>
