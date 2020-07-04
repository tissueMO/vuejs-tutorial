<template>
  <div class="digits">
    <Digit
      v-for="(digit, index) in digits"
      :key="index"
      :number="digit" />
  </div>
</template>

<style lang="scss">
.digits {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import Digit from './Digit'

export default {
  name: 'Digits',
  components: { Digit },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    digitSize: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    digits: {
      get () {
        const digits = []
        let value = Math.min(this.value, Math.pow(10, this.digitSize) - 1)

        for (let i = 0; i < this.digitSize; i++) {
          // 1の位を取得し続ける
          const digit = value % 10
          digits.push(digit)
          value = Math.floor(value / 10)
        }

        // 大きい位から小さい位の順に並ぶようにする
        return digits.reverse()
      },
    },
  },
}
</script>
