const dict = { a: 1 };
const vm  = new Vue({
  data: dict,
  created: function() {
    // Vue によって呼ばれるコールバック関数内の this は常に自身の Vueインスタンス を指す
    // このため this を束縛しないアロー関数は使用できない
    console.log("a is: " + this.a);
  },
});  // => a is: 1

// 以下はもちろん成立する
vm.a == dict.a;  // => true

// 元のデータを変更するとVueインスタンス上のdataも更新される
vm.a = 2;
dict.a;  // => 2

// 逆もまた然り
dict.a = 3;
vm.a;  // => 3

// Vueインスタンスが作成された後に追加されたメンバーはリアクティブなDOM更新の対象とならない
dict.a = 1;  // => DOMに更新される (Vueインスタンス作成時点で存在していたメンバーなので)
dict.b = 1;  // => DOMに更新されない

// ===================================================

vm.$watch('a', function(newValue, oldValue) {
  // vm.a の値が変わったときに呼び出されるコールバック関数
});
