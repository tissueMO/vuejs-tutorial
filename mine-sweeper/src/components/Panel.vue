<template>
  <div id="panel">
    <div class="row" v-for="(row, rowIndex) in tiles" :key="rowIndex">
      <div class="col" v-for="(col, colIndex) in row" :key="colIndex">
        <Tile
          :row="rowIndex"
          :col="colIndex"
          :number="col.number"
          :hasMine="col.hasMine"
          :opened="col.opened"
          :flagged="col.flagged"
          :badFlagged="col.badFlagged"
          :frozen="isGameOver || isCleared"
          @open="open"
          @flag="flag" />
      </div>
    </div>
    <!-- <p>開放可能なマス残り: {{ safeCountOfRemaining }}</p> -->
    <!-- <p v-if="isStarted">開けていない地雷マス残り: {{ hiddenMineCountOfRemaining }}</p> -->
    <div class="alert alert-gameover"
      v-if="isGameOver && hiddenMineCountOfRemaining === 0" @click="init">
      <p>ゲームオーバー</p>
    </div>
    <div class="alert alert-cleared" v-if="isCleared" @click="init">
      <p>ゲームクリア</p>
    </div>
  </div>
</template>

<style lang="scss">
#panel {
  .row {
    display: flex;
    justify-content: center;
  }

  .alert {
    position: fixed;
    width: 100vw;
    height: 100px;
    top: calc(50% - 100px);
    text-align: center;
    padding: 1rem 0;
    display: flex;
    justify-content: center;
    align-items: center;

    &.alert-gameover {
      background: yellow;
    }
    &.alert-cleared {
      background: cyan;
    }

    p {
      font-size: 2rem;
    }
  }
}
</style>

<script>
import Tile from './Tile'
import shuffle from 'shuffle-array'
import eventBus from '../eventbus'

const OFFSET_MATRIX = [
  [[-1, -1], [0, -1], [1, -1]],
  [[-1, 0], null, [1, 0]],
  [[-1, 1], [0, 1], [1, 1]],
]

export default {
  name: 'Panel',
  components: { Tile },
  data: function() {
    return {
      isStarted: false,
      isCleared: false,
      isGameOver: false,
      tiles: [],
    }
  },
  props: {
    timeSecondsLimit: {
      type: Number,
      required: false,
      default: null,
    },
    sizeWidth: {
      type: Number,
      required: true,
      default: 7,
    },
    sizeHeight: {
      type: Number,
      required: true,
      default: 9,
    },
    mineCount: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  created: function () {
    this.init()

    const that = this
    eventBus.$on('init', () => that.init())
  },
  watch: {
    sizeWidth () {
      this.init()
    },
    sizeHeight () {
      this.init()
    },
  },
  computed: {
    safeCountOfRemaining: {
      get () {
        return this.tiles.reduce(
          (accumulator, row) => accumulator + row.reduce(
            (acc, col) => acc + ((!col.opened && !col.hasMine) ? 1 : 0),
            0
          ),
          0
        )
      },
    },
    hiddenMineCountOfRemaining: {
      get () {
        return this.tiles.reduce(
          (accumulator, row) => accumulator + row.reduce(
            (acc, col) => acc + ((!col.opened && col.hasMine) ? 1 : 0),
            0
          ),
          0
        )
      },
    },
    mineTiles: {
      get () {
        return this.tiles.map(
          row => row.filter(
            col => col.hasMine
          )
        ).flat()
      },
    },
    flaggedTiles: {
      get () {
        return this.tiles.map(
          row => row.filter(
            col => col.flagged
          )
        ).flat()
      },
    },
    closedTiles: {
      get () {
        return this.tiles.map(
          row => row.filter(
            col => !col.opened
          )
        ).flat()
      }
    }
  },
  methods: {
    // 盤面を初期化
    init () {
      this.isStarted = false
      this.isCleared = false
      this.isGameOver = false
      this.$emit('reset')

      // 空の盤面を生成
      this.tiles = [...Array(this.sizeHeight)].map(
        () => [...Array(this.sizeWidth)].map(
          () => null
        )
      )
      this.tiles.forEach(
        (row, rowIndex) => row.forEach(
          (col, colIndex) => {
            col = {
              row: rowIndex,
              col: colIndex,
              flagged: false,
              badFlagged: false,
              opened: false,
              number: 0,
              hasMine: false,
            }
            this.tiles[rowIndex].splice(colIndex, 1, col)
          }
        )
      )
    },

    // 任意のマスを開けてゲームを始める
    start (row, col) {
      this.isStarted = true
      this.$emit('start')

      // 指定されたマスに地雷を埋めないようにして地雷を配置
      let putCount = 0;
      while (putCount < this.mineCount) {
        const x = Math.floor(Math.random() * this.sizeWidth)
        const y = Math.floor(Math.random() * this.sizeHeight)
        if (!this.tiles[y][x].hasMine && (col !== x || row !== y)) {
          this.tiles[y][x] = Object.assign(this.tiles[y][x], {
            hasMine: true,
          })
          this.tiles[y].splice(x, 1, this.tiles[y][x])
          putCount++
        }
      }

      // 埋められた地雷に従って各マス目の数字を埋めていく
      this.tiles.forEach((row, rowIndex) =>
        row.forEach((col, colIndex) => {
          if (col.hasMine) {
            col.number = -1
            return
          }

          let surroundedMineCount = 0
          OFFSET_MATRIX.forEach((r, subRowIndex) =>
            r.forEach((c, subColIndex) => {
              if (!OFFSET_MATRIX[subRowIndex][subColIndex]) {
                return
              }

              const tx = OFFSET_MATRIX[subRowIndex][subColIndex][0]
              const ty = OFFSET_MATRIX[subRowIndex][subColIndex][1]
              if (colIndex + tx < 0 || this.sizeWidth <= colIndex + tx) {
                return
              }
              if (rowIndex + ty < 0 || this.sizeHeight <= rowIndex + ty) {
                return
              }

              if (this.tiles[rowIndex + ty][colIndex + tx].hasMine) {
                surroundedMineCount++;
              }
            })
          )

          this.tiles[rowIndex][colIndex] = Object.assign(this.tiles[rowIndex][colIndex], {
            number: surroundedMineCount,
          })
          this.tiles[rowIndex].splice(colIndex, 1, this.tiles[rowIndex][colIndex])
        })
      )
    },

    // 任意のマスのフラグを切り替える
    flag (e) {
      const row = e[0]
      const col = e[1]

      this.tiles[row][col] = Object.assign(this.tiles[row][col], {
        flagged: !this.tiles[row][col].flagged,
      })
      this.tiles[row].splice(col, 1, this.tiles[row][col])
    },

    // 任意のマスを開ける
    open (e) {
      const row = e[0]
      const col = e[1]

      if (this.tiles[row][col].opened) {
        return;
      }
      if (!this.isStarted) {
        this.start(row, col)
      }
      this.tiles[row][col].opened = true

      if (this.tiles[row][col].hasMine) {
        // ゲームオーバー
        this.isGameOver = true
        this.$emit('end', false)
        this.openMinesAll()
      }
      if (this.tiles[row][col].number === 0) {
        // 再帰的に周囲のマスを開ける
        OFFSET_MATRIX.forEach((r, subRowIndex) =>
          r.forEach((c, subColIndex) => {
            if (!OFFSET_MATRIX[subRowIndex][subColIndex]) {
              return
            }

            const tx = OFFSET_MATRIX[subRowIndex][subColIndex][0]
            const ty = OFFSET_MATRIX[subRowIndex][subColIndex][1]
            if (col + tx < 0 || this.sizeWidth <= col + tx) {
              return
            }
            if (row + ty < 0 || this.sizeHeight <= row + ty) {
              return
            }

            this.open([row + ty, col + tx])
          })
        )
      }
      if (this.safeCountOfRemaining === 0 && !this.isCleared) {
        // ゲームクリア
        this.isCleared = true
        this.$emit('end', true)

        // 残った地雷マスにすべてフラグを立てる
        const that = this
        this.closedTiles.forEach(tile => that.flag([tile.row, tile.col]))
      }
    },

    // すべての地雷マスを開ける
    openMinesAll () {
      const mines = this.mineTiles
      const flags = this.flaggedTiles
      const openTargetTiles = mines.concat(flags)
      shuffle(openTargetTiles)

      openTargetTiles.forEach((tile, i) => {
        if (tile.hasMine || tile.flagged) {
          const that = this
          setTimeout(
            () => that._openSilently(tile.row, tile.col),
            50 * (i + 1)
          )
        }
      })
    },

    // 指定マスを開ける (システム用)
    _openSilently (row, col) {
      this.tiles[row][col] = Object.assign(this.tiles[row][col], {
        opened: true,
        badFlagged: !this.tiles[row][col].hasMine && this.tiles[row][col].flagged,
      })
      this.tiles[row].splice(col, 1, this.tiles[row][col])
    },
  },
}
</script>
