<template>
  <div id="game">
    <fieldset>
      <label for="">難易度: </label>
      <select v-model="selectedLevel">
        <option
          v-for="(level, name) in levels"
          :key="level.difficulity">{{ name }}</option>
      </select>
    </fieldset>

    <Panel
      :timeSecondsLimit="levels[selectedLevel].timeSecondsLimit"
      :sizeWidth="levels[selectedLevel].sizeWidth"
      :sizeHeight="levels[selectedLevel].sizeHeight"
      :mineCount="levels[selectedLevel].mineCount" />
  </div>
</template>

<style lang="scss">
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
          mineCount: 1,
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
    }
  },
  created () {
    this.selectedLevel = Object.keys(this.levels)[0]
  },
}
</script>
