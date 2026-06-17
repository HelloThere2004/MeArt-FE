<template>
  <div class="about">
    <h1>MÊ ART </h1>
    <h1>NƠI ƯƠM MẦM ĐAM MÊ VÀ CHINH PHỤC ƯỚC MƠ GIẢNG ĐƯỜNG</h1>
    <p>
      Thành lập từ tháng 7/2022, Mê Art ra đời với sứ mệnh đồng hành cùng các bạn học sinh trên con
      đường chinh phục giấc mơ nghệ thuật và bước vào giảng đường Đại học mong muốn. Đây không chỉ
      là nơi luyện thi, mà còn là không gian kết nối những tâm hồn đồng điệu để cùng nghiên cứu,
      sáng tạo và giao lưu. Trong suốt thời gian qua, Mê Art tự hào đã đào tạo nhiều thế hệ học viên
      ứng tuyển thành công vào các ngành Mỹ thuật Công nghiệp và Kiến trúc tại các trường Đại học
      lớn, với tỷ lệ trúng tuyển đạt trên 80%. Bên cạnh đó, lớp còn là nơi rèn luyện năng khiếu,
      trau dồi kiến thức và kỹ năng chuyên sâu cho: Các bạn học sinh định hướng chuyên nghiệp. Học
      sinh có nhu cầu chuẩn bị hồ sơ du học. Sinh viên thuộc các trường Đại học trong nước và quốc
      tế cần nâng cao tay nghề. Mê Art chân thành cảm ơn quý phụ huynh và các bạn học viên đã luôn
      tin tưởng, đồng hành cùng chúng tôi trong suốt hành trình qua!
    </p>
    <h2>Sau đây là những thành viên của lớp vẽ Mê Art</h2>
    <div v-for="member in members" :key="member.name">
      <Member :member="member" />
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import Member from '../components/Member.vue'
import { supabase } from '@/utils/supabase.js'
export default {
  name: 'AboutView',
  components: {
    Member,
  },
  data() {
    return {
      members: [],
    }
  },
  async mounted() {
    await this.fetchMembers()
  },
  methods: {
    async fetchMembers() {
      const { data, errors } = await supabase.from('members').select('*')
      if (errors) {
        console.log('Lỗi khi kéo data từ Supabase:', errors.message)
        return
      }
      if (data) {
        this.members = data.map((item) => ({
          name: item.name,
          role: item.role,
          img: item.image_url,
          description: item.description,
        }))
      }
    },
  },
}
</script>

<style>
.about {
  padding: 20px;
  margin: 20px auto;
  max-width: 80%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.08);
  border: 1px solid #e8ecf4;
}

.about h1 {
  font-size: 40px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #1e40af;
}

.about h2 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #1e40af;
  font-weight: bold;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .about {
    padding: 15px;
    margin: 10px auto;
    max-width: 95%;
  }

  .about h1 {
    font-size: 26px;
    margin-bottom: 12px;
  }

  .about h2 {
    font-size: 17px;
    margin-bottom: 12px;
  }

  .about p {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .about h1 {
    font-size: 22px;
  }

  .about p {
    font-size: 14px;
  }
}
</style>
