<template>
    <div>
        <h1>Create a New Trail</h1>
        <MapTrailCreator />
    </div>
</template>

<script>
import MapTrailCreator from '../components/MapTrailCreator.vue';

export default {
    name: 'CreateTrailView',
    components: {
        MapTrailCreator
    }
};
</script>

<style scoped>
h1 {
    text-align: center;
    margin-bottom: 20px;
}
</style>