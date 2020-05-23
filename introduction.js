const app1 = new Vue({
  el: '#app1',
  data: {
    message: 'Hello Vue!',
  },
});

const app2 = new Vue({
  el: '#app2',
  data: {
    message: 'このページのロード日時 ' + new Date().toLocaleString(),
  },
})

const app3 = new Vue({
  el: '#app3',
  data: {
    visible: true,
  },
})

const app4 = new Vue({
  el: '#app4',
  data: {
    todoTexts: [
      { text: '起きる' },
      { text: '歯を磨く' },
      { text: '働く' },
      { text: '帰る' },
    ],
    todos: [
      '起きる',
      '歯を磨く',
      '働く',
      '帰る',
    ],
  },
})

const app5 = new Vue({
  el: '#app5',
  data: {
    message: 'このメッセージがひっくり返るよ',
  },
  methods: {
    reverseMessage: function() {
      // ボタン押下時の処理: メッセージをひっくり返す
      // DOMに一切触れることなくHTMLを動的に書き換えることができる
      this.message = this.message
        .split('')
        .reverse()
        .join('');
    },
  },
});

const app6 = new Vue({
  el: '#app6',
  data: {
    message: 'Hello Vue!',
  },
});

Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>[{{ todo.id }}] {{ todo.text }}</li>',
});
const app7 = new Vue({
  el: '#app7',
  data: {
    todos: [
      { id: 0, text: '起きる'},
      { id: 1, text: '二度寝する'},
      { id: 2, text: '寝坊する'},
      { id: 3, text: 'ダッシュ'},
    ]
  }
});
