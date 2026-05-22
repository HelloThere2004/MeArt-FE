<template>
  <main class="home-content">
    <div class="container">
      <div class="row">
        <div class="col-md-6 content">
          <h1>Chào mừng các bạn đã đến trang thông tin của lớp vẽ Mê Art</h1>
          <p>
            Lớp vẽ MeArt là một nơi để các bạn học sinh có ước mơ theo ngành vẽ có thể đến học tập
            và rèn luyện kỹ năng vẽ của mình và có thể vào được trường đại học mình mong muốn.
          </p>
          <p>
            Ngoài ra, những bạn chưa ôn thi đại học vào các ngành mỹ thuật cũng có thể đến để học
            tập và rèn luyện kỹ năng vẽ của mình vì đam mê cũng như là giao lưu, kết bạn với những
            người bạn có cùng sở thích với mình.
          </p>
          <RouterLink to="/about" class="btn text-dark">
            Vào đây để tìm hiểu thêm về Mê Art các bạn nhé!
          </RouterLink>
        </div>
        <div class="col-md-6 image-grid">
          <div class="row g-2 row-image-container">
            <div class="col-6 home-image">
              <img src="../assets/image/HomePage/homeIMG1.jpg" alt="MeArt Logo" class="img-fluid" />
            </div>
            <div class="col-6 home-image">
              <img src="../assets/image/HomePage/homeIMG5.jpg" alt="MeArt Logo" class="img-fluid" />
            </div>
          </div>
          <div class="row g-2 row-image-container">
            <div class="col-6 home-image">
              <img src="../assets/image/HomePage/homeIMG6.jpg" alt="MeArt Logo" class="img-fluid" />
            </div>
            <div class="col-6 home-image">
              <img src="../assets/image/HomePage/homeIMG4.jpg" alt="MeArt Logo" class="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home-content {
  padding: 20px;
  max-width: 100%;
}

.home-content h1 {
  font-size: 30px;
  margin-bottom: 20px;
}

.home-content p {
  font-size: 20px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.home-content .content {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.home-content .btn {
  background-color: #ffea61;
  color: #333;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
}

.image-grid {
  padding: 0 10px;
}

.row-image-container {
  margin-left: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.home-image {
  padding: 0 5px;
  width: 300px;
  height: 300px;
  position: relative;
}

.home-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

/* Mobile: stack everything */
@media (max-width: 768px) {
  .home-content {
    padding: 10px;
  }

  .home-content h1 {
    font-size: 22px;
    margin-bottom: 12px;
  }

  .home-content p {
    font-size: 15px;
    margin-bottom: 10px;
  }

  .home-content .content {
    padding: 15px;
    margin-bottom: 15px;
  }

  .home-content .btn {
    padding: 8px 16px;
    font-size: 15px;
    display: inline-block;
    width: auto;
  }

  .image-grid {
    padding: 0;
  }

  .home-image {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    padding: 0 4px;
  }

  .row-image-container {
    gap: 0;
    margin-bottom: 8px;
  }
}

@media (max-width: 480px) {
  .home-content h1 {
    font-size: 20px;
  }

  .home-content p {
    font-size: 14px;
    margin-bottom: 8px;
  }
}
</style>
