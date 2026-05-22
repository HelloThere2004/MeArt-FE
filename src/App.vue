<script setup>
import { RouterView } from 'vue-router'
import Nav from './components/Nav.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app-root">
    <Nav />
    <RouterView class="main_content" />
    <Footer />
  </div>
</template>

<style>
/* Global reset & base */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #585858;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
}

#app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main_content {
  flex: 1;
}

/* Global mobile adjustments */
@media (max-width: 768px) {
  body {
    font-size: 15px;
  }

  img {
    max-width: 100%;
    height: auto;
  }
}
</style>
