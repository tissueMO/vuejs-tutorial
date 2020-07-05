<template>
  <div class="tile button" :class="[{'button-disabled': !canOpen}]">
    <input
      type="checkbox"
      :id="id"
      :checked="opened"
      :disabled="!canOpen"
      @click="$emit('open', [row, col])" />

    <label
      :for="id"
      :class="[numberClass, openedClass, mineClass, flaggedClass, badFlaggedClass]"
      @click.right.prevent="$emit('flag', [row, col])" />

    <!-- 地雷 -->
    <transition name="transition-bomb">
      <font-awesome-icon
        class="fa fa-bomb"
        icon="bomb" size="lg"
        v-if="opened && hasMine" />
    </transition>

    <!-- フラグ -->
    <font-awesome-icon
      class="fa fa-flag"
      icon="flag" size="lg"
      v-if="!opened && flagged"
      @click.right.prevent="$emit('flag', [row, col])" />

    <!-- 地雷ではないマスに立てたフラグのアイコン -->
    <font-awesome-icon
      class="fa fa-times"
      icon="times" size="lg"
      v-if="opened && badFlagged" />
  </div>
</template>

<style lang="scss">
@import "../assets/scss/_common";

.tile {
  position: relative;
  user-select: none;

  .fa {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    width: 100%;

    &.fa-flag {
      color: red;
    }
    &.fa-bomb {
      color: black;
    }
    &.fa-times {
      color: red;
    }

    // 地雷爆発トランジション
    &.transition-bomb {
      &-enter-active {
        animation: bounce-in 0.5s;
      }

      @keyframes bounce-in {
        0% {
          transform: translate(-50%, -50%) scale(0);
        }
        50% {
          transform: translate(-50%, -50%) scale(1.5);
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
        }
      }
    }
  }

  input[type="checkbox"] {
    display: none;

    & + label {
      $size: 32px;
      user-select: none;

      display: block;
      width: $size;
      height: $size;
      text-align: center;

      &.opened {
        background: lightgray;
        border: dotted 1px #333;
        box-sizing: border-box;

        &.mine {
          background-color: red;

          &.flagged {
            background-color: yellow;
          }
        }

        @for $i from 1 through 8 {
          &.number-#{$i}:not(.flagged-bad) {
            &:after {
              @extend .font-notosans-bold;

              content: '#{$i}';
              font-size: $size - 8px;
              line-height: $size;

              @if $i == 1 {
                color: blue;
              }
              @else if $i == 2 {
                color: green;
              }
              @else if $i == 3 {
                color: red;
              }
              @else if $i == 4 {
                color: darkblue;
              }
              @else if $i == 5 {
                color: darkred;
              }
              @else if $i == 6 {
                color: darkturquoise;
              }
              @else if $i == 7 {
                color: black;
              }
              @else if $i == 8 {
                color: dimgray;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<script>
export default {
  name: 'Tile',
  data: function () {
    return {
      numberClass: '',
      openedClass: '',
      mineClass: '',
      flaggedClass: '',
      badFlaggedClass: '',
    }
  },
  props: {
    row: {
      type: Number,
      required: true,
    },
    col: {
      type: Number,
      required: true,
    },
    number: {
      type: Number,
      required: true,
      default: 0,
    },
    opened: {
      type: Boolean,
      default: false,
    },
    hasMine: {
      type: Boolean,
      default: false,
    },
    flagged: {
      type: Boolean,
      default: false,
    },
    badFlagged: {
      type: Boolean,
      default: false,
    },
    frozen: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    number () {
      this.numberClass = (this.number > 0) ? `number-${this.number}` : '';
    },
    opened () {
      this.openedClass = this.opened ? 'opened' : ''
      this.mineClass = (this.hasMine && this.opened) ? 'mine' : ''
    },
    flagged () {
      this.flaggedClass = this.flagged ? 'flagged' : ''
    },
    badFlagged () {
      this.badFlaggedClass = this.badFlagged ? 'flagged-bad' : ''
    },
  },
  computed: {
    id: {
      get () {
        return `tile-${this.row}-${this.col}`
      },
    },
    canOpen: {
      get () {
        return !this.opened && !this.flagged && !this.frozen
      },
    },
  }
}
</script>
