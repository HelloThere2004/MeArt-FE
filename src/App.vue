<script setup>
import { RouterView } from 'vue-router'
import Nav from './components/Nav.vue'
import Footer from './components/Footer.vue'
import { ref, onMounted } from 'vue'
import { supabase } from '../utils/supabase'

const todos = ref([])

async function getTodos() {
  const { data } = await supabase.from('todos').select()
  todos.value = data
}

onMounted(() => {
  getTodos()
})
</script>

<template>
  <body>
    <Nav />

    <RouterView class="main_content" />

    <Footer />
  </body>
</template>

<style scoped>
body {
  margin: 0;
  background-color: #585858;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main_content {
  flex: 1;
}
</style>
