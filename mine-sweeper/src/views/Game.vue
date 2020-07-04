<template>
  <div id="game">
    <div class="form-group">
      <label for="level">難易度: </label>
      <select id="level" v-model="selectedLevelName">
        <option
          v-for="(level, name) in levels"
          :key="level.difficulity">{{ name }}</option>
      </select>
    </div>
    <div class="form-group">
      <!-- 地雷数 -->
      <Digits :value="selectedLevel.mineCount" :digitSize="3" />

      <div class="face">
        <font-awesome-icon
          class="fa fa-face"
          size="2x"
          :icon="emotion"
          @click="init" />
      </div>

      <!-- 経過時間 -->
      <Digits :value="timeSecondsCount" :digitSize="3" />
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
</template>

<style lang="scss">
#game {
  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .form-group {
    @extend .flex;
    margin: 0.5rem 0;

    label {
      margin-right: 0.5rem;
    }

    p {
      width: 5rem;
      text-align: center;
    }

    .face {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0.5rem 0.75rem;
      background-color: #000;

      .fa-face {
        margin: 0 0.5rem;
        color: yellow;
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
          sizeWidth: 7,
          sizeHeight: 7,
          mineCount: 2,
        },
        "普通": {
          difficulity: 1,
          sizeWidth: 15,
          sizeHeight: 15,
          mineCount: 50,
        },
        "難しい": {
          difficulity: 2,
          sizeWidth: 30,
          sizeHeight: 30,
          mineCount: 100,
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
      console.log('START')
      this.timeSecondsCount = 0
      const that = this
      this.timer = setInterval(
        () => that.timeSecondsCount = Math.min(that.timeSecondsCount + 1, 999),
        1000
      )
    },
    end (cleared) {
      console.log('END')
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
