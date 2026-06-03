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
/* ===== BLUE/WHITE GLOBAL COLOR TONE ===== */
:root {
  --primary-blue: #1e40af;
  --primary-blue-dark: #173285;
  --primary-blue-light: #3b5cc5;
  --bg-light: #f0f4ff;
  --bg-white: #ffffff;
  --text-dark: #1e293b;
  --text-muted: #64748b;
  --accent-gold: rgb(120, 110, 0); /* Giữ lại cho một số highlight đặc biệt */
}

/* Global reset & base */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: var(--bg-light);
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
  color: var(--text-dark);
}

#app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-light);
}

.main_content {
  flex: 1;
  background-color: var(--bg-light);
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
