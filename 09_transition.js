const transition1 = new Vue({
  el: '#transition1',
  data: {
    show: true,
  },
});

const transition2 = new Vue({
  el: '#transition2',
  data: {
    items: [
      "こ", "ん", "に", "ち", "は", "V", "u", "e", ".", "j", "s", "の", "世", "界", "へ",
    ],
  },
  methods: {
    reverse: function() {
      this.items = this.items.reverse();
    },
    slide: function() {
      this.items.push(this.items.shift());
    },
  },
});
