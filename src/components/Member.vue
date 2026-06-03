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
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.08);
  border: 1px solid #e8ecf4;
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
  color: #1e40af;
}

.member-card .role {
  font-weight: bold;
  color: #64748b;
  margin-bottom: 8px;
}

.member-card .description {
  color: #475569;
  line-height: 1.4;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .member-card {
    padding: 12px;
  }

  .member-card .row {
    flex-direction: column;
    text-align: center;
  }

  .member-card img {
    width: 100%;
    max-width: 250px;
    height: auto;
    aspect-ratio: 1 / 1;
    margin: 0 auto 12px auto;
    display: block;
  }

  .member-card h3 {
    font-size: 18px;
  }

  .member-card .role {
    font-size: 15px;
  }

  .member-card .description {
    font-size: 14px;
  }
}
</style>
