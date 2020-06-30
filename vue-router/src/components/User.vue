<template>
  <div>
    <!-- <p>User [{{ this.$route.params.id }}]</p> -->
    <p>User [{{ id }}]</p>

    <router-view name="user-header" />
    <router-view />
    <router-view name="user-footer" />

    <button @click="previous">Previous</button>
    <button @click="top">Top</button>
    <button @click="next">Next</button>
  </div>
</template>

<script>
import router from '@/router/index.js'

export default {
  name: 'User',

  // ルーター側で props: true が指定されていると this.$route.params を props として取得できるようになる
  props: ['id'],

  methods: {
    previous: function () {
      // ページ遷移のヒストリーを一つ戻す
      router.go(-1)
    },
    next: function () {
      // ページ遷移のヒストリーを一つ進める
      router.go(1)
    },
    top: function () {
      // JSからもルーターに従ったページ遷移を行うことができる
      router.push({ path: '/' })
    }
  }
}
</script>
