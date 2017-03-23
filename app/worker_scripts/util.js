export default class Util {

  static extend(a, b) {
    for (var i in b) {
      a[i] = b[i];
    }
    return a;
  }

  static normal_random(mean, variance) {
    return Math.sqrt(-2.0 * Math.log(1 - Math.random())) * Math.cos(2.0 * Math.PI * (1 - Math.random())) * variance + mean;
  }

  static get_data(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.send();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 0) {
            resolve(xhr);
          } else {
            reject(xhr);
          }
        }
      }
    });
  }

  static sum(arr) {
    var ret = 0;
    for (var i = 0; i != arr.length; i++) {
      ret += arr[i];
    }
    return ret;
  }

  // TODO: あとで直す
  static choice(arr) {
    var rand = Math.random() * Util.sum(arr);

    for (var i = 0; rand > 0; i++) {
      rand -= arr[i]
    }

    return i - 1;
  }

  static sample(preds, diversity) {
    var exp_preds = [];
    for (var i = 0; i != preds.length; i++) {
      exp_preds[i] = Math.exp(Math.log(preds[i]) / diversity);
    }
    return Util.choice(exp_preds);
  }
}
