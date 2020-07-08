//################################################################################
//   グローバルストア
//################################################################################
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

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

    /**
     * 選択された難易度のキー
     */
    selectedLevelName: '',
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
    selectedLevelName: (state, { value }) => state.selectedLevelName = value,
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

  plugins: [
    // ストアの永続化を行うプラグイン
    createPersistedState({
      key: 'mine-sweeper',

      // リロード時のみ復元し、新しいタブやウィンドウに対しては復元対象外とする
      storage: window.sessionStorage,

      // 永続化対象とする state
      paths: [
        'selectedLevelName',
      ]
    })
  ]
})
