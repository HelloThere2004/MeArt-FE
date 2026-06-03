<template>
  <div class="container">
    <div class="wrapper">
      <div class="text">
        <h1>Các tác phẩm tiêu biểu của các bạn học sinh tại Mê Art</h1>
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
import { supabase } from '@/utils/supabase.js'

export default {
  name: 'Gallery',
  components: {
    Pic,
  },
  data() {
    return {
      pics: [],
    }
  },
  async mounted() {
    await this.fetchGalleryData()
  },
  methods: {
    async fetchGalleryData() {
      const { data, error } = await supabase.from('gallery').select('*')

      if (error) {
        console.error('Lỗi khi kéo data từ Supabase:', error.message)
        return
      }

      if (data) {
        this.pics = data.map((item) => ({
          id: item.id,
          img: item.image_url,
          name: item.title,
          author: item.author,
          description: item.description,
        }))
      }
    },
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
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
}

.text {
  text-align: center;
  margin: 20px 0;
}

.text h1 {
  font-size: 32px;
  color: #1e40af;
  margin-bottom: 15px;
  font-weight: bold;
}

.text p {
  font-size: 18px;
  color: #64748b;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .wrapper {
    width: 95%;
    padding: 15px 15px;
  }

  .text h1 {
    font-size: 22px;
    margin-bottom: 10px;
  }

  .text p {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .wrapper {
    width: 100%;
    padding: 10px 10px;
  }

  .text h1 {
    font-size: 19px;
  }
}
</style>
