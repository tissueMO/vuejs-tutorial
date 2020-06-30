import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from '../views/NotFound.vue'
import Home from '../views/Home.vue'
import User from '../components/User.vue'
import UserHome from '../components/UserHome.vue'
import UserProfile from '../components/UserProfile.vue'
import UserHeader from '../components/UserHeader.vue'
import UserFooter from '../components/UserFooter.vue'

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

    // エイリアス: このルートでも同じ結果を得られるようになる
    alias: '/usr/:id',

    // $route.params.id を props: id としてコンポーネント側で使用できるようにする
    props: true,

    // ルートはネストすることができる
    children: [
      {
        // サブルートに該当しないときのビューをセットできる
        path: '',
        name: 'User',
        components: {
          default: UserHome,
          'user-header': UserHeader,
          'user-footer': UserFooter
        }
      },
      {
        path: 'profile',
        components: {
          default: UserProfile,
          'user-header': UserHeader,
          'user-footer': UserFooter
        }
      }
    ]
  },
  {
    // リダイレクト: URLはリダイレクト先のものに置き換わる
    path: '/u/:id',
    redirect: { name: 'User' }
  },
  {
    // ルートが見つからなかった場合に表示するフォールバック用ルート
    // HTML5 History モードを有効にする場合はWebサーバーのリライト設定によって404エラーが出なくなるため、その代替として必要
    path: '*',
    component: NotFound
  }
]

const router = new VueRouter({
  // HTML5 History モード: ルートに # ハッシュを付けずに純粋なパスでURLを表現する
  // 内蔵サーバーは標準対応しているが、Apache等のWebサーバーに乗せる場合は別途リライト設定が必要
  mode: 'history',
  routes
})

export default router
