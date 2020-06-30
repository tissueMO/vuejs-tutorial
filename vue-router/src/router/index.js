import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import User from '../components/User.vue'
import UserHome from '../components/UserHome.vue'
import UserProfile from '../components/UserProfile.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    // コード分割を実現し、ルートを読み込んだ時点で遅延ロードされる
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    // :id の部分は任意の文字列を取り、コンポーネント側からは this.$route.params.id として取得できる
    path: '/user/:id',
    component: User,
    children: [
      {
        // サブルートに該当しないときのビューをセットできる
        path: '',
        component: UserHome
      },
      {
        // ルートはネストすることができる
        path: 'profile',
        component: UserProfile
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
