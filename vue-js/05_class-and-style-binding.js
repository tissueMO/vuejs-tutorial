const classbind1 = new Vue({
  el: '#classbind1',
  data: {
    isActive: true,
  },
});

const classbind2 = new Vue({
  el: '#classbind2',
  data: {
    classes: {
      active: true,
      'text-danger': true,
    },
  }
});

// ベンダープレフィックスが必要なプロパティを使用sるう場合、自動で付加してくれる
const stylebind1 = new Vue({
  el: '#stylebind1',
  data: {
    styles: {
      color: 'red',
      'font-weight': 'bold',
    },
  },
});
