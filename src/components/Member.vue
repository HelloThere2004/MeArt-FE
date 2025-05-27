<template>
  <div class="container member-card my-3">
    <div class="row align-items-center">
      <div class="col-sm-12 col-md-3">
        <img :src="member.img" :alt="member.name" class="img-fluid" />
      </div>
      <div class="col-sm-12 col-md-9">
        <h3>{{ member.name }}</h3>
        <p class="role">{{ member.role }}</p>
        <p class="description">{{ member.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

export default {
  name: 'Member',
  props: {
    member: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.member-card {
  background-color: #e4e4e4;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.member-card img {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
}

.member-card h3 {
  font-size: 20px;
  margin-bottom: 5px;
  color: #333;
}

.member-card .role {
  font-weight: bold;
  color: #666;
  margin-bottom: 8px;
}

.member-card .description {
  color: #555;
  line-height: 1.4;
}

@media (max-width: 480px) {
  .member-card {
    padding: 10px;
  }

  .member-card img {
    width: 150px;
    height: 150px;
    margin-bottom: 10px;
  }

  .member-card h3 {
    font-size: 18px;
  }
}
</style>
