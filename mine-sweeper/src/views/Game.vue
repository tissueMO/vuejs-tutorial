<template>
  <div id="game">
    <div class="logo">
      <img src="../assets/img/logo.svg">
      <span>マインスイーパー</span>
      <img src="../assets/img/logo.svg">
    </div>

    <div class="form-group level">
      <label for="level">難易度: </label>
      <select
        id="level"
        v-model="selectedLevelName"
        @change="init">
        <option
          v-for="(level, name) in levels"
          :key="level.difficulity">{{ name }}</option>
      </select>
    </div>

    <div class="game-wrapper text-center">
      <div class="game">
        <div class="indicators-wrapper form-group">
          <div class="indicators">
            <!-- 地雷数 -->
            <Digits :value="selectedLevelDetail.mineCount" :digitSize="3" />

            <!-- リセットボタン: ニコちゃんマーク -->
            <div class="face button" @click="init">
              <div class="face-background mx-auto">
                <font-awesome-icon
                  class="fa fa-face"
                  size="3x"
                  :icon="emotion" />
              </div>
            </div>

            <!-- 経過時間 -->
            <Digits :value="timeSecondsCount" :digitSize="3" />
          </div>
        </div>

        <!-- タイルが敷き詰められたパネル -->
        <Panel
          :sizeWidth="selectedLevelDetail.sizeWidth"
          :sizeHeight="selectedLevelDetail.sizeHeight"
          :mineCount="selectedLevelDetail.mineCount"
          @start="start"
          @end="end" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../assets/scss/_common";

#game {
  display: flex;
  flex-direction: column;

  .logo {
    @extend .flex;
    @extend .font-notosans-bold;

    font-size: 3rem;
    margin-bottom: 3rem;
    color: #444;

    span {
      margin: 0 0.1rem;
    }

    img {
      width: 5rem;
      height: 5rem;
      margin: 0;
    }
  }

  .level {
    @extend .font-notosans;

    margin-bottom: 2rem;
    align-items: center;

    label {
      margin-right: 0.5rem;
    }
    select, option {
      @extend .font-notosans;
      width: 5rem;
    }
  }

  .game-wrapper {
    .game {
      @include border-3d(8px, #eeeeee, #808080, lightgray);
      display: inline-block;
      padding: 12px;
    }
  }

  .indicators {
    @include border-3d(4px, #808080, #dfdfdf, lightgray);
    display: inline-flex;
    margin: 0;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0.8rem;

    & > label {
      margin-right: 0.5rem;
    }

    p {
      width: 5rem;
      text-align: center;
    }

    .face {
      min-width: 0;
      min-height: 0;
      padding: 0.25rem;
      margin: 0 0.5rem;

      .face-background {
        @extend .flex;

        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        position: relative;
        background-color: #000;

        .fa-face {
          margin: 0;
          color: yellow;
        }
      }
    }
  }
}
</style>

<script>
import Panel from '../components/Panel'
import Digits from '../components/Digits'
import { LEVELS } from '../config'

export default {
  name: 'Game',
  components: {
    Panel,
    Digits,
  },

  data: function () {
    return {
      /**
       * 経過秒数
       */
      timeSecondsCount: 0,

      /**
       * 経過秒数タイマー
       */
      timer: null,

      /**
       * ニコちゃんマークの表情名 (FontAwesome のアイコン名に対応)
       */
      emotion: 'smile',
    }
  },

  computed: {
    /**
     * レベルごとの固有設定
     */
    levels () {
      return LEVELS
    },

    /**
     * 選択された難易度の名前
     */
    selectedLevelName: {
      get () {
        return this.$store.state.selectedLevelName
      },
      set (value) {
        this.$store.commit('selectedLevelName', { value })
      },
    },

    /**
     * 選択された難易度の詳細情報
     */
    selectedLevelDetail () {
      return !this.selectedLevelName ? null : this.levels[this.selectedLevelName]
    },
  },

  created () {
    if (!Object.keys(this.levels).includes(this.selectedLevelName)) {
      // デフォルトの難易度を選択
      this.selectedLevelName = Object.keys(this.levels)[0]
    }
    this.init()
  },

  methods: {
    /**
     * ゲームを初期化します。
     */
    init () {
      this.$store.dispatch('initialize')

      // ニコちゃんマークの表情をニュートラルに戻す
      this.emotion = 'smile'

      // タイマーを初期化
      clearInterval(this.timer)
      this.timer = null
      this.timeSecondsCount = 0
    },

    /**
     * ゲームを開始します。
     */
    start () {
      this.timeSecondsCount = 0

      // タイマー計測を開始
      const that = this
      this.timer = setInterval(() => that.timeSecondsCount++, 1000)
    },

    /**
     * ゲームを終了します。
     * @param {Boolean} cleared ゲームクリアしたかどうか
     */
    end (cleared) {
      // ゲームの結果に応じてニコちゃんマークの表情を切り替える
      this.emotion = cleared ? 'laugh-beam' : 'dizzy'

      // タイマー計測を停止
      clearInterval(this.timer)
    },
  },
}
</script>
