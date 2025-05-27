<template>
  <div class="container pic-card my-3">
    <div class="row">
        <div class="col-sm-12 col-md-10">
            <img :src="pic.img || ''" :alt="pic.alt || 'Image'" class="img-fluid" />
        </div>
        <div class="col-sm-12 col-md-2">
            <h3>{{ pic.name }}</h3>
            <p class="author">{{ pic.author }}</p>
            <p class="description">{{ pic.description }}</p>
        </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

export default {
  name: 'Pic',
  props: {
    pic: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.pic-card {
  background-color: #e4e4e4;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pic-card img {
  width: 700px;
  height: 700px;
  object-fit: cover;
  border-radius: 4px;
}

.pic-card h3 {
  font-size: 20px;
  margin-bottom: 5px;
  color: #333;
}

.pic-card .author {
  font-weight: bold;
  color: #666;
  margin-bottom: 8px;
  text-align: left;
}


.col-md-2 {
  display: flex;
  justify-content: center;
  align-items: start;
 flex-direction: column;
}

.pic-card .description {
  color: #555;
  line-height: 1.4;
}

@media (max-width: 480px) {
  .pic-card {
    padding: 10px;
  }

  .pic-card img {
    width: 150px;
    height: 150px;
    margin-bottom: 10px;
  }

  .pic-card h3 {
    font-size: 18px;
  }
}
</style>
