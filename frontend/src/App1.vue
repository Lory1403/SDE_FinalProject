<template>
  <div id="app">
    <weatherApp />
  </div>
</template>

<script>
import weatherApp from './components/WeatherWidget.vue'
export default { 
  name: 'App', 
  components: { 
    weatherApp 
    } 
  }
</script>

<style></style>