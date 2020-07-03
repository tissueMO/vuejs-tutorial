<template>
  <div>
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
  </div>
</template>

<style lang="scss">
input[type="checkbox"] {
  display: none;

  & + label {
    user-select: none;

    display: block;
    width: 20px;
    height: 20px;
    text-align: center;
    border: 1px solid #000;
    margin: 2px;

    background-color: #000;

    &.flagged {
      background-color: blue;
    }

    &.opened {
      background-color: #fff;

      &.mine {
        background-color: red;

        &.flagged-bad {
          &:after {
            content: '\d7';
            font-size: 1rem;
            line-height: 1.25rem;
          }
        }
      }

      @for $i from 1 through 8 {
        &.number-#{$i} {
          &:after {
            content: '#{$i}';
            font-size: 1rem;
            margin: 0 0.37rem;
            line-height: 1.25rem;
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
  },
  watch: {
    number () {
      this.numberClass = (this.number > 0) ? `number-${this.number}` : '';
    },
    opened () {
      this.openedClass = this.opened ? 'opened' : ''
      this.mineClass = (this.hasMine && this.opened) ? 'mine' : ''
    },
    hasMine () {
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
        return !this.opened && !this.flagged
      },
    },
  }
}
</script>
