<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/large-content">LargeContent</router-link> |
      <router-link to="/load-after-navigation">LoadAfter</router-link> |
      <router-link to="/load-before-navigation">LoadBefore</router-link> |
      <router-link to="/user/USER-TEST1">User1</router-link> |
      <!-- 名前が付けられたルートに対してはパスではなく名前でリンクを作れる -->
      <router-link :to="{ name: 'User', params: { id: 'USER-TEST2' }}">User2</router-link> |
      <!-- ルートのリダイレクト -->
      <router-link to="/u/USER-TEST3">User3</router-link> |
      <!-- ルートのエイリアス -->
      <router-link to="/usr/USER-TEST4">User4</router-link>
    </div>

    <transition mode="out-in">
      <router-view/>
    </transition>

    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/large-content">LargeContent</router-link> |
      <router-link to="/load-after-navigation">LoadAfter</router-link> |
      <router-link to="/load-before-navigation">LoadBefore</router-link> |
      <router-link to="/user/USER-TEST1">User1</router-link> |
      <!-- 名前が付けられたルートに対してはパスではなく名前でリンクを作れる -->
      <router-link :to="{ name: 'User', params: { id: 'USER-TEST2' }}">User2</router-link> |
      <!-- ルートのリダイレクト -->
      <router-link to="/u/USER-TEST3">User3</router-link> |
      <!-- ルートのエイリアス -->
      <router-link to="/usr/USER-TEST4">User4</router-link>
    </div>
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

.v {
  &-enter {
    opacity: 0;

    &-active {
      transition: opacity .5s;
    }
  }
  &-leave {
    &-to {
      opacity: 0;
    }
    &-active {
      transition: opacity .5s;
    }
  }
}
</style>
