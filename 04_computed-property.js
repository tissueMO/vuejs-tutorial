// message を変更すると reversedMessage も合わせて更新される
const computedprop1 = new Vue({
  el: '#computedprop1',
  data: {
    message: 'Hello',
  },
  computed: {
    reversedMessage: function() {
      return this.message.split('').reverse().join('');
    },
  },
});

// 姓か名を変更するとフルネームが更新される
// フルネームを更新すると半角スペースを区切りに姓と名がそれぞれ更新される
const computedprop2 = new Vue({
  el: '#computedprop2',
  data: {
    lastName: '山田',
    firstName: '太郎',
  },
  computed: {
    fullName: {
      get: function() {
        return `${this.lastName} ${this.firstName}`;
      },
      set: function(value) {
        const names = value.split(' ');
        this.lastName = names[0];
        this.firstName = names[names.length - 1];
      },
    },
  },
});
