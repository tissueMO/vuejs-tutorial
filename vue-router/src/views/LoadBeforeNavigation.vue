<template>
  <div class="post">
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null
    }
  },
  beforeRouteEnter (route, redirect, next) {
    // このルートに入るのが初回である場合
    fetch('http://localhost:5500/vue-router/src/assets/data.json')
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('コンテンツの動的取得に失敗しました')
        }
      })
      .then(data => {
        next(vm => vm.setData(data.posts[1], null))
      })
      .catch(error => {
        next(vm => vm.setData(null, error.message))
      })
  },
  beforeRouteUpdate (to, from, next) {
    // このルートが既に描画されている場合
    this.post = null
    const that = this

    fetch('http://localhost:5500/vue-router/src/assets/data.json')
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('コンテンツの動的取得に失敗しました')
        }
      })
      .then(data => {
        that.setData(data.posts[1], null)
        next()
      })
      .catch(error => {
        that.setData(null, error.message)
        next()
      })
  },
  methods: {
    setData (post, error) {
      // 実際にはこれが呼び出されるまで画面に変化が起こらない
      // ユーザビリティを考慮するならば何らかのインジケーターを表示する必要がある
      this.post = post
      this.error = error
    }
  }
}
</script>
