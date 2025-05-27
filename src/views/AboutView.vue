<template>
  <div class="about">
    <h1>Về lớp vẽ Mê Art</h1>
    <p>
      Lớp Mê Art được thành lập với mong muốn giúp các bạn học sinh có ước mơ theo ngành vẽ có thể
      đến học tập và rèn luyện kỹ năng vẽ của mình và có thể vào được trường đại học mình mong muốn.
      Ngoài ra, những bạn chưa ôn thi đại học vào các ngành mỹ thuật cũng có thể đến để học tập và
      rèn luyện kỹ năng vẽ của mình vì đam mê cũng như là giao lưu, kết bạn với những người bạn có
      cùng sở thích với mình. Lớp Mê Art được thành lập vào năm 2022, đến nay đã {{ year }} rồi đó.
      Khi đó lớp chỉ có 3 bạn học viên thôi nhưng đến nay đã có gần 30 bạn học viên rồi. Cảm ơn các
      bạn và quý phụ huynh đã tin tưởng và đồng hành cùng lớp Mê Art trong suốt thời gian qua.
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

export default {
  name: 'AboutView',
  components: {
    Member,
  },
  data() {
    return {
      members: [
        {
          name: 'Nguyễn Văn Hảo',
          role: 'Giáo viên chính',
          description:
            'Thầy Hảo là một giáo viên dạy vẽ với nhiều năm kinh nghiệm. Thầy dạy đã đi dạy và chấm tốt nghiệp ở các trường đại học như Đại học Văn Lang, Đại học Tôn Đức Thắng hơn 20 năm nay. Tại Mê Art, thầy Hảo là người trực tiếp giảng dạy các bạn cũng như theo dõi và hỗ trợ các bạn trong việc chọn ngành, chọn trường và các thông tin thi cử vào các đại học.',
          img: new URL('../assets/image/member/Hao.jpg', import.meta.url).href,
        },
        {
          name: 'Hồ Ngọc Lệ',
          role: 'Trợ giảng/Tư vấn',
          description:
            'Cô Lệ cũng là giáo viên dạy vẽ với nhiều năm kinh nghiệm giống như thầy Hảo. Cô hiện nay là giảng viên của trường Đại học Tôn Đức Thắng với thâm niên hơn 15 năm. Trước đó cô cũng đã công tác tại các trường đại học khác như Đại học Hồng Bàng, Đại học Văn Lang. Đôi lúc cô Lệ cũng sẽ hỗ trợ các bạn trong quá trình học và đặc biệt là cô sẽ chia sẻ thông tin chi tiết các ngành vẽ cũng như các thông tin thi cử vào trường Đại học Tôn Đức Thắng.',
          img: new URL('../assets/image/member/Le.jpg', import.meta.url).href,
        },
        {
          name: 'Nguyễn Cung Đàn',
          role: 'Trợ giảng/Tư vấn',
          description:
            'Anh Đàn hiện là một giảng viên tại Đại học Sư Phạm - Kỹ Thuật và từng là giảng viên thỉnh giảng tại Cao đẳng Việt Mỹ. Anh Đàn cùng với thầy Hảo sẽ là người trực tiếp giảng dạy các bạn trong quá trình học tại Mê Art. Anh Đàn cũng sẽ hỗ trợ các bạn trong việc chọn ngành, chọn trường và các thông tin thi cử vào các đại học.',
          img: new URL('../assets/image/member/Dan.jpg', import.meta.url).href,
        },
        {
          name: 'Cam béo',
          role: 'Thú cưng',
          description:
            'Bên cạnh các thầy cô thì Mê Art còn có một bé mèo thân thiện hay đi lại trong lớp để các bạn học sinh có thể vui đùa, giải trí trong giờ giải lao nữa.',
          img: new URL('../assets/image/member/Cam.jpg', import.meta.url).href,
        },
      ],
    }
  },
  computed: {
    year() {
      return parseInt(new Date().getFullYear()) - 2022
    },
  },
}
</script>

<style>
.about {
  padding: 20px;
  margin: 20px auto;
  max-width: 80%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.about h1 {
  font-size: 40px;
  margin-bottom: 20px;
  font-weight: bold;
  color: rgb(120, 110, 0);
}

.about h2 {
  font-size: 20px;
  margin-bottom: 15px;
  color: rgb(120, 110, 0);
  font-weight: bold;
}
</style>
