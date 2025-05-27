<template>
  <div class="container">
    <div class="wrapper">
      <div class="text">
        <h1>Đây là các tác phẩm tiêu biểu của các bạn học sinh tại Mê Art</h1>
      </div>
      <div class="pics" v-for="pic in pics" :key="pic.id">
        <Pic :pic="pic" />
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import Pic from '../components/Pic.vue'

export default {
  name: 'Gallery',
  components: {
    Pic,
  },
  data() {
    return {
    pics: [
      {
        id: 1,
        img: new URL('../assets/image/gallery/pic1.jpg', import.meta.url).href,
        name: 'Tác phẩm 1',
        author: 'Nguyễn Văn A',
        description: 'Tác phẩm vẽ phong cảnh mùa thu.',
      },
      {
        id: 2,
        img: new URL('../assets/image/gallery/pic2.jpg', import.meta.url).href,
        name: 'Tác phẩm 2',
        author: 'Trần Thị B',
        description: 'Tác phẩm chân dung thiếu nữ.',
      },
      {
        id: 3,
        img: new URL('../assets/image/gallery/pic3.jpg', import.meta.url).href,
        name: 'Tác phẩm 3',
        author: 'Lê Văn C',
        description: 'Tác phẩm vẽ tĩnh vật hoa quả.',
      },
      {
        id: 4,
        img: new URL('../assets/image/gallery/pic4.jpg', import.meta.url).href,
        name: 'Tác phẩm 4',
        author: 'Phạm Thị D',
        description: 'Tác phẩm vẽ phong cảnh biển.',
      },
      {
        id: 5,
        img: new URL('../assets/image/gallery/pic5.jpg', import.meta.url).href,
        name: 'Tác phẩm 5',
        author: 'Hoàng Văn E',
        description: 'Tác phẩm vẽ phố cổ Hà Nội.',
      },
      {
        id: 6,
        img: new URL('../assets/image/gallery/pic6.jpg', import.meta.url).href,
        name: 'Tác phẩm 6',
        author: 'Đỗ Thị F',
        description: 'Tác phẩm vẽ động vật hoang dã.',
      },
      ],
    }
  },
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 20px;
}

.wrapper {
  width: 80%;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px 40px;
}

.text {
  text-align: center;
  margin: 20px 0;
}

.text h1 {
  font-size: 32px;
  color: rgb(120, 110, 0);
  margin-bottom: 15px;
  font-weight: bold;
}

.text p {
  font-size: 18px;
  color: #555;
}
</style>
