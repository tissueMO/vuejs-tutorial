<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/user/USER-TEST1">User1</router-link> |
      <!-- 名前が付けられたルートに対してはパスではなく名前でリンクを作れる -->
      <router-link :to="{ name: 'User', params: { id: 'USER-TEST2' }}">User2</router-link> |
      <!-- ルートのリダイレクト -->
      <router-link to="/u/USER-TEST3">User3</router-link> |
      <!-- ルートのエイリアス -->
      <router-link to="/usr/USER-TEST4">User4</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
