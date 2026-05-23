<template>
  <div class="footer container-fluid">
    <div class="row">
      <div class="col-md-6 footer-info">
        <h3 class="text">Thông tin liên hệ</h3>
        <p>Thầy Nguyễn Văn Hảo</p>
        <p>Địa chỉ: 47 Đường Trần Thị Liền, Xã Nhà Bè</p>
        <p>Điện thoại: 0988510571</p>
      </div>
      <div class="col-md-6 text-md-end footer-slogan">
        <h2 class="slogan-main">"Thương Yêu</h2>
        <h3 class="slogan-sub">và</h3>
        <h2 class="slogan-main">Trách Nhiệm"</h2>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
export default {
  name: 'Footer',
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
.footer {
  background-color: #ffea61;
  padding: 20px 30px;
  line-height: 1.4;
  font-size: 14px;
}

.footer h3 {
  font-size: 22px;
  font-weight: bold;
}

.footer-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.footer-slogan {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.slogan-main {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  font-family: 'Pacifico', sans-serif;
}

.slogan-sub {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  font-family: 'Pacifico', sans-serif;
}

/* Mobile: stack vertically, center text */
@media (max-width: 768px) {
  .footer {
    padding: 15px 15px;
    font-size: 13px;
    text-align: center;
  }

  .footer h3 {
    font-size: 17px;
    font-weight: bold;
  }

  .footer p {
    margin: 6px 0;
  }

  .footer-slogan {
    margin-top: 12px;
    align-items: center;
  }

  .slogan-main {
    font-size: 20px;
  }

  .slogan-sub {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 12px 10px;
    font-size: 12px;
  }

  .footer h3 {
    font-size: 15px;
  }

  .slogan-main {
    font-size: 18px;
  }

  .slogan-sub {
    font-size: 16px;
  }
}
</style>
