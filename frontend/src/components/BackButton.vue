<template>
    <button class="button-type" @click="$router.go(-1)">Back</button>
</template>
<script>
export default {
  name: 'BackButton'
};
</script>
<style>
.button-type {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
  transition: background-color 0.3s ease;
}
</style>