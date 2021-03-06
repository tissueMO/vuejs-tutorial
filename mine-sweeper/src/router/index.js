import Vue from 'vue'
import VueRouter from 'vue-router'
import Game from '../views/Game'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Game',
    component: Game,
    meta: {
      title: 'マインスイーパー',
    },
  },
  {
    // リダイレクト: すべてルートに戻す
    path: '*',
    redirect: { name: 'Game' }
  },
]

const router = new VueRouter({
  // 自前のWebサーバーで稼働させる場合は適宜サーバー側の設定を施した上でヒストリーモードを使うことを推奨
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title
  next()
})

export default router
