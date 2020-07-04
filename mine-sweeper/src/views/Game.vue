<template>
  <div id="game">
    <div class="form-group">
      <label for="level">難易度: </label>
      <select id="level" v-model="selectedLevel">
        <option
          v-for="(level, name) in levels"
          :key="level.difficulity">{{ name }}</option>
      </select>
    </div>
    <p>
      経過時間: {{ timeSecondsCount }}
    </p>

    <Panel
      :timeSecondsLimit="levels[selectedLevel].timeSecondsLimit"
      :sizeWidth="levels[selectedLevel].sizeWidth"
      :sizeHeight="levels[selectedLevel].sizeHeight"
      :mineCount="levels[selectedLevel].mineCount"
      @start="start"
      @end="end"
      @reset="reset" />
  </div>
</template>

<style lang="scss">
.form-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 0;

  label {
    margin-right: 0.5rem;
  }
}
</style>

<script>
import Panel from '../components/Panel'

export default {
  name: 'Game',
  components: { Panel },
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
      selectedLevel: '',
      timeSecondsCount: 0,
      timer: null,
    }
  },
  created () {
    this.selectedLevel = Object.keys(this.levels)[0]
  },
  methods: {
    start () {
      console.log('START')
      this.timeSecondsCount = 0
      const that = this
      this.timer = setInterval(() => that.timeSecondsCount++, 1000)
    },
    end () {
      console.log('END')
      clearInterval(this.timer)
    },
    reset () {
      this.timeSecondsCount = 0
    },
  },
}
</script>
