<template>
  <div class="tile">
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
    <font-awesome-icon
      class="fa fa-bomb"
      icon="bomb"
      v-if="opened && hasMine" />
    <font-awesome-icon
      class="fa fa-flag"
      icon="flag"
      v-if="!opened && flagged"
      @click.right.prevent="$emit('flag', [row, col])" />
    <font-awesome-icon
      class="fa fa-times"
      icon="times"
      v-if="opened && badFlagged" />
  </div>
</template>

<style lang="scss">
.tile {
  position: relative;
  user-select: none;
}

.fa {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &.fa-flag {
    color: white;
  }
  &.fa-bomb {
    color: black;
  }
  &.fa-times {
    color: red;
  }
}

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

    &.opened {
      background-color: #fff;

      &.mine {
        background-color: red;

        &.flagged {
          background-color: yellow;
        }
      }

      @for $i from 1 through 8 {
        &.number-#{$i}:not(.flagged-bad) {
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
