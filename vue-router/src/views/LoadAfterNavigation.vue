<template>
  <div class="post">
    <div v-if="loading" class="loading">
      Loading...
    </div>

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
  created () {
    this.fetch()
  },
  watch: {
    $route: 'fetch'
  },
  methods: {
    fetch () {
      this.post = null
      this.error = null
      this.loading = true

      // Vueフロントサーバーとは別に、VSCode等でローカルWebサーバーを立てておく必要あり
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
          that.loading = false
          that.post = data.posts[0]
        })
        .catch(error => {
          that.loading = false
          that.error = error.message
        })
    }
  }
}
</script>
