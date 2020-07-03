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
          @open="open"
          @flag="flag" />
      </div>
    </div>
    <span>開放可能なマス残り: {{ safeCountOfRemaining }}</span>
  </div>
</template>

<style lang="scss">
.row {
  display: flex;
  justify-content: center;
}
</style>

<script>
import Tile from './Tile'

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
      tiles: []
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
  },
  watch: {
    sizeWidth () {
      console.log("変更検知")
      this.init()
    },
    sizeHeight () {
      console.log("変更検知")
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
  },
  methods: {
    // 盤面を初期化
    init () {
      this.isStarted = false
      this.isCleared = false

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
        this.openMinesAll()
        const that = this
        setTimeout(() => {
          alert('BOMB!!')
          that.init()
        }, 10)
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
        const that = this
        setTimeout(() => {
          alert('CONGLATULATIONS!!')
          that.init()
        }, 10)
      }
    },

    // すべての地雷マスを開ける
    openMinesAll () {
      this.tiles.forEach((row, rowIndex) =>
        row.forEach((col, colIndex) => {
          if (col.hasMine) {
            this.tiles[rowIndex][colIndex] = Object.assign(this.tiles[rowIndex][colIndex], {
              opened: true,
            })
            if (col.flagged) {
              // フラグ失敗
              this.tiles[rowIndex][colIndex] = Object.assign(this.tiles[rowIndex][colIndex], {
                badFlagged: true,
              })
            }
            this.tiles[rowIndex].splice(colIndex, 1, this.tiles[rowIndex][colIndex])
          }
        })
      )
    },
  },
}
</script>
