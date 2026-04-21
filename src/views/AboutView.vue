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
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

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
  computed: {
    year() {
      return parseInt(new Date().getFullYear()) - 2022
    },
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
