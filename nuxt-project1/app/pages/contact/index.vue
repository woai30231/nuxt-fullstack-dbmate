<script setup lang="ts">
const { data } = await useFetch('/test/contact');

</script>
<template>
  <div>
    <h1>{{data.message}}</h1>
  </div>
</template>