Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>',
});
const component1 = new Vue({
  el: '#component1',
});
