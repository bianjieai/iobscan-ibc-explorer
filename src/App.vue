<template>
  <router-view />
</template>

<script setup>
let script = document.createElement('script');
script.src = `https://s4.cnzz.com/z_stat.php?id=${import.meta.env.VITE_UMENG_ID}&web_id=${import.meta.env.VITE_UMENG_WEB_ID}`;
script.language = 'JavaScript';
document.body.appendChild(script);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 320px;
  overflow-x: auto;
}
</style>
