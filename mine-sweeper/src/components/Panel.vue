<template>
  <!-- 地雷が埋め込まれているかもしれないタイルを敷き詰めたパネル -->
  <div id="panel-wrapper" class="form-group">
    <div id="panel" class="d-inline-block">
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
            :frozen="frozen"
            @open="open"
            @flag="flag" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../assets/scss/_common";

#panel {
  @include border-3d(5px, #808080, #dfdfdf, lightgray);
  margin: 0 auto;

  .row {
    @extend .flex;

    &:first-child {
      .col {
        label {
          border-top: none;
        }
      }
    }
    &:last-child {
      .col {
        label {
          border-bottom: none;
        }
      }
    }
  }

  .col {
    &:first-child {
      label {
        border-left: none;
      }
    }
    &:last-child {
      label {
        border-right: none;
      }
    }
  }
}
</style>

<script>
import Tile from './Tile'
import shuffle from 'shuffle-array'
import eventBus from '../eventbus'

// 周囲8タイルを数えるのに使うオフセット用行列
const OFFSET_MATRIX = [
  [[-1, -1], [0, -1], [1, -1]],
  [[-1, 0], null, [1, 0]],
  [[-1, 1], [0, 1], [1, 1]],
]

export default {
  name: 'Panel',
  components: {
    Tile,
  },

  data: function() {
    return {
      // ゲームが開始されたかどうか
      isStarted: false,

      // ゲームがクリアされたかどうか
      isCleared: false,

      // 地雷タイルを開けてゲームオーバーになったかどうか
      isGameOver: false,

      // このパネル内に敷き詰められたタイル
      tiles: [],

      // 大量アニメーション用タイマー群
      timers: [],
    }
  },

  props: {
    // 盤面の横方向タイル数
    sizeWidth: {
      type: Number,
      required: true,
      default: 7,
    },

    // 盤面の縦方向タイル数
    sizeHeight: {
      type: Number,
      required: true,
      default: 9,
    },

    // 敷き詰める地雷の数
    mineCount: {
      type: Number,
      required: true,
      default: 10,
    },
  },

  created: function () {
    this.init()

    // イベントバスを通じて親コンポーネントからのイベントを受け取れるようにする
    const that = this
    eventBus.$on('init', () => that.init())
  },

  watch: {
    // 盤面の大きさが変更されたらゲームを初期化
    sizeWidth () {
      this.init()
    },
    sizeHeight () {
      this.init()
    },
  },

  computed: {
    // 画面上にまだ見えていない地雷ではないタイルの個数
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

    // 画面上にまだ見えていない地雷タイルの個数
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

    // 地雷タイルを1次元配列で返す
    mineTiles: {
      get () {
        return this.tiles.map(row => row.filter(col => col.hasMine)).flat()
      },
    },

    // フラグが立てられたタイルを1次元配列で返す
    flaggedTiles: {
      get () {
        return this.tiles.map(row => row.filter(col => col.flagged)).flat()
      },
    },

    // まだ開けられていないタイルを1次元配列で返す
    closedTiles: {
      get () {
        return this.tiles.map(row => row.filter(col => !col.opened)).flat()
      }
    },

    // プレイヤー操作が行えない状態であるかどうかを返す
    frozen: {
      get () {
        return this.isGameOver || this.isCleared
      }
    },
  },

  methods: {
    // 盤面を初期化
    init () {
      this.isStarted = false
      this.isCleared = false
      this.isGameOver = false
      this.timers.forEach(timer => clearTimeout(timer))
      this.timers = []

      // 親コンポーネントに初期化イベントを送出
      this.$emit('reset')

      // 空の盤面を生成
      this.tiles = [...Array(this.sizeHeight)].map(
        () => [...Array(this.sizeWidth)].map(
          () => null
        )
      )

      // 各タイルに初期データを流し込む
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

            // このタイルに対する変更を反映
            this.tiles[rowIndex].splice(colIndex, 1, col)
          }
        )
      )
    },

    // 任意のタイルを開けてゲームを始める
    start (row, col) {
      this.isStarted = true

      // 親コンポーネントにゲーム開始イベントを送出
      this.$emit('start')

      // 地雷を配置
      this._putMines(row, col)

      // 配置した地雷の位置関係に基づいて各タイルの数字を埋め込む
      this._applyNumbers()
    },

    // 指定されたタイルに地雷を埋めないようにして地雷を配置する
    _putMines (row, col) {
      let putCount = 0;

      while (putCount < this.mineCount) {
        const x = Math.floor(Math.random() * this.sizeWidth)
        const y = Math.floor(Math.random() * this.sizeHeight)

        if (!this.tiles[y][x].hasMine && (col !== x || row !== y)) {
          this.tiles[y][x] = Object.assign(
            this.tiles[y][x],
            {
              hasMine: true,
            }
          )

          // このタイルに対する変更を反映
          this.tiles[y].splice(x, 1, this.tiles[y][x])
          putCount++
        }
      }
    },

    // 現在埋められている地雷の位置関係に基づいて各タイルの数字を埋め込む
    _applyNumbers () {
      this.tiles.forEach((row, rowIndex) =>
        row.forEach((col, colIndex) => {
          if (col.hasMine) {
            col.number = -1
            return
          }

          // 周囲8タイルの地雷の数を数える
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

          this.tiles[rowIndex][colIndex] = Object.assign(
            this.tiles[rowIndex][colIndex],
            {
              number: surroundedMineCount,
            }
          )

          // このタイルに対する変更を反映
          this.tiles[rowIndex].splice(colIndex, 1, this.tiles[rowIndex][colIndex])
        })
      )
    },

    // 任意のタイルのフラグを切り替える
    flag (e) {
      if (this.frozen) {
        return
      }

      // イベント引数を分解
      const [row, col] = e

      // フラグを切り替える
      this.tiles[row][col] = Object.assign(
        this.tiles[row][col],
        {
          flagged: !this.tiles[row][col].flagged,
        }
      )

      // このタイルに対する変更を反映
      this.tiles[row].splice(col, 1, this.tiles[row][col])
    },

    // 任意のタイルを開ける
    open (e) {
      // イベント引数を分解
      const [row, col] = e

      if (this.tiles[row][col].opened) {
        return;
      }

      if (!this.isStarted) {
        // 最初のタイルオープンでゲームを開始する
        this.start(row, col)
      }
      this.tiles[row][col].opened = true

      if (this.tiles[row][col].hasMine) {
        // ゲームオーバー
        this.isGameOver = true
        this.$emit('end', false)
        this.openMinesAndFlagsAll()
        return
      }

      if (this.tiles[row][col].number === 0) {
        // 数字も地雷もないタイルを開けた場合は再帰的に周囲のタイルを開ける
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
        this.$emit('end', true)
        this.isCleared = true

        // 残った地雷タイルにすべてフラグを立てる
        const that = this
        this.closedTiles.forEach(tile => that._flagForce(tile.row, tile.col))
      }
    },

    // すべての地雷タイルとフラグが立てられたタイルを開ける
    openMinesAndFlagsAll () {
      // 地雷タイルを開ける順序をランダムにする
      this.timers = []
      const mines = this.mineTiles
      const flags = this.flaggedTiles
      const openTargetTiles = mines.concat(flags)
      shuffle(openTargetTiles)

      // 徐々にアニメーションしながら地雷タイルを開けていく
      const that = this
      openTargetTiles.forEach((tile, i) => {
        if (tile.hasMine || tile.flagged) {
          that.timers.push(
            setTimeout(() => that._openSilently(tile.row, tile.col), 50 * (i + 1))
          )
        }
      })
    },

    // 指定タイルを開ける (システム用)
    _openSilently (row, col) {
      this.tiles[row][col] = Object.assign(
        this.tiles[row][col],
        {
          opened: true,
          badFlagged: !this.tiles[row][col].hasMine && this.tiles[row][col].flagged,
        }
      )

      // このタイルに対する変更を反映
      this.tiles[row].splice(col, 1, this.tiles[row][col])
    },

    // 強制的にフラグを置く (システム用)
    _flagForce (row, col) {
      this.tiles[row][col] = Object.assign(
        this.tiles[row][col],
        {
          flagged: true,
        }
      )

      // このタイルに対する変更を反映
      this.tiles[row].splice(col, 1, this.tiles[row][col])
    },
  },
}
</script>
