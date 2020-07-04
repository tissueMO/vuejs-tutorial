<template>
  <div id="game">
    <div class="logo">
      <img src="../assets/img/logo.svg">
      <span>マインスイーパー</span>
      <img src="../assets/img/logo.svg">
    </div>

    <div class="form-group level">
      <label for="level">難易度: </label>
      <select id="level" v-model="selectedLevelName">
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
            <Digits :value="selectedLevel.mineCount" :digitSize="3" />

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

        <Panel
          :timeSecondsLimit="selectedLevel.timeSecondsLimit"
          :sizeWidth="selectedLevel.sizeWidth"
          :sizeHeight="selectedLevel.sizeHeight"
          :mineCount="selectedLevel.mineCount"
          @start="start"
          @end="end"
          @reset="reset" />
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
      $border-width: 8px;
      border-top: $border-width solid #eeeeee;
      border-right: $border-width solid #808080;
      border-bottom: $border-width solid #808080;
      border-left: $border-width solid #eeeeee;
      display: inline-block;
      padding: 12px;
      background: lightgray;
    }
  }

  .indicators {
    $border-width: 4px;
    border-top: $border-width solid #808080;
    border-right: $border-width solid #dfdfdf;
    border-bottom: $border-width solid #dfdfdf;
    border-left: $border-width solid #808080;
    box-sizing: border-box;
    display: inline-flex;
    background: lightgray;
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
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
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
import eventBus from '../eventbus'

export default {
  name: 'Game',
  components: {
    Panel,
    Digits,
  },
  data: function () {
    return {
      levels: {
        "簡単": {
          difficulity: 0,
          sizeWidth: 9,
          sizeHeight: 9,
          mineCount: 10,
        },
        "普通": {
          difficulity: 1,
          sizeWidth: 16,
          sizeHeight: 16,
          mineCount: 40,
        },
        "難しい": {
          difficulity: 2,
          sizeWidth: 30,
          sizeHeight: 16,
          mineCount: 99,
        },
      },
      selectedLevelName: '',
      timeSecondsCount: 0,
      timer: null,
      emotion: 'smile',
    }
  },
  computed: {
    selectedLevel () {
      return !this.selectedLevelName ? null : this.levels[this.selectedLevelName]
    },
  },
  created () {
    this.selectedLevelName = Object.keys(this.levels)[0]
  },
  methods: {
    start () {
      this.timeSecondsCount = 0
      const that = this
      this.timer = setInterval(() => that.timeSecondsCount++, 1000)
    },
    end (cleared) {
      this.emotion = cleared ? 'laugh-beam' : 'dizzy'
      clearInterval(this.timer)
    },
    reset () {
      this.emotion = 'smile'
      this.timeSecondsCount = 0
      clearInterval(this.timer)
    },
    init () {
      eventBus.$emit('init')
    },
  },
}
</script>
