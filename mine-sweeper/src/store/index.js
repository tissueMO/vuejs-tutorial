//################################################################################
//   グローバルストア
//################################################################################
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /**
     * ゲームが開始されたかどうか
     */
    isStarted: false,

    /**
     * ゲームがクリアされたかどうか
     */
    isCleared: false,

    /**
     * 地雷タイルを開けてゲームオーバーになったかどうか
     */
    isGameOver: false,
  },

  getters: {
    /**
     * プレイヤー操作が行えない状態であるかどうか
     */
    isFrozen: state => state.isGameOver || state.isCleared,
  },

  mutations: {
    started: (state, { value }) => state.isStarted = value,
    cleared: (state, { value }) => state.isCleared = value,
    gameOver: (state, { value }) => state.isGameOver = value,
  },

  actions: {
    initialize ({ commit }) {
      commit('started', { value: false })
      commit('cleared', { value: false })
      commit('gameOver', { value: false })
    },

    startGame ({ commit }) {
      commit('started', { value: true })
    },

    clearGame ({ commit }) {
      commit('cleared', { value: true })
    },

    gameOver ({ commit }) {
      commit('gameOver', { value: true })
    },
  },
})
