<template>
  <div>
    <p>User [{{ this.$route.params.id }}]</p>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'User'
}
</script>
