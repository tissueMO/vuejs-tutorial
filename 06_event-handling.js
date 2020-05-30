const eventHandling1 = new Vue({
  el: '#eventHandling1',
  methods: {
    say: function(message, e) {
      if (e) {
        e.preventDefault();
      }
      alert(message);
    },
  },
});

const eventHandling2 = new Vue({
  el: '#eventHandling2',
});

const eventHandling3 = new Vue({
  el: '#eventHandling3',
  methods: {
    submit: function() {
      alert('フォームが送信されました');
    },
  }
});
