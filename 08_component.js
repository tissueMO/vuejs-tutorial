Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>',
});
const component1 = new Vue({
  el: '#component1',
});

Vue.component('blog-item', {
  props: ['title'],
  template: `
    <div>
      <h3>{{ title }}</h3>
      <button v-on:click="$emit('count', 1)">いいね！</button>
    </div>
  `,
});
const component2 = new Vue({
  el: '#component2',
  data: {
    posts: [
      { id: 0, title: 'Blog1' },
      { id: 1, title: 'Blog2' },
      { id: 2, title: 'Blog3' },
    ],
    count: 0,
  },
});

Vue.component('alert-item', {
  template: `
    <div style="color: red;">
      <strong>Error: </strong>
      <slot><!-- ここに任意のコンテンツが挿入されます --></slot>
    </div>
  `,
});
const component3 = new Vue({
  el: '#component3',
});
