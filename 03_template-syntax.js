const syntax1 = new Vue({
  el: '#syntax1',
  data: {
    redHtml: '<span style="color: red;">赤文字</span>',
  },
});

const syntax2 = new Vue({
  el: '#syntax2',
  data: {
    number: 100,
    ok: true,
    message: 'メッセージがひっくり返されるよ',
  },
});

const syntax3 = new Vue({
  el: '#syntax3',
  data: {
    url: 'https://github.com/tissueMO',
  },
  methods: {
    doSomething: function() {
      alert('ボタンが押されたよ');
    },
  },
});
