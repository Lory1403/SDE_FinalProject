<template>
  <div id="app">
    <!-- Visualizza il contenuto della pagina attualmente attiva -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'SDE_Final_Project',
};
</script>

<style>
/* Stili globali */
body {
      background-color: black;
      color: white; /* Per rendere il testo visibile su sfondo nero */
    }
</style>
