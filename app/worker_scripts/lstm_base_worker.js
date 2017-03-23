// model ... modelへのパス 必須
// weights ... weightsへのパス 必須
// metadata ... metadataへのパス 必須
// corpus ... 学習文章へのパス 必須
// switch_interval ... 文章生成時のseedを交換する周期（文字ごと）。0以下で交換しない。
// diversity ... 文章の多様性

import Util from './util.js';
import * as KerasJS from './keras.js'

var debug_log = function(text) {
  self.postMessage({
    type: "debug",
    data: text
  });
}

class LSTMBase {
  constructor(args) {
    this.model = null;
    this.text = "";
    this.chars = [];
    this.char_indices = {};
    this.indices_char = {};
    this.maxlen = args.maxlen;

    this.switch_interval = args.switch_interval;
    this.diversity = args.diversity;

    this.model = new KerasJS.Model({
      filepaths: {
        model: args.model,
        weights: args.weights,
        metadata: args.metadata,
      },
      gpu: true
    });

    (async() => {
      const response = await fetch(args.corpus);
      this.text = await response.text();
      await this.pre_process_function();
      this.generate_words();
    })();
  }

  pre_process_function() {
    debug_log("corpus length: " + String(this.text.length));
    this.chars = Array.from(new Set(this.text)).sort();
    debug_log('total chars: ' + String(this.chars.length));

    for (var i = 0; i != this.chars.length; i++) {
      this.char_indices[this.chars[i]] = i;
      this.indices_char[i] = this.chars[i];
    }

    debug_log('Loading model...')
    return this.model.ready();
  }

  // 次のcharを推定する。charのindexを返す。
  generate_char(seed) {
    var x = new Float32Array(this.maxlen * this.chars.length);
    for (var k = 0; k != seed.length; k++) {
      x[k * this.chars.length + this.char_indices[seed[k]]] = 1;
    }

    return this.model.predict({
      "input": x
    }).then((preds) => {
      return Util.sample(preds.output, this.diversity);
    });
  }

  generate_words() {
    var sentence = this.text.substr(Math.floor(Math.random() * this.text.length), this.maxlen);
    var tmp = 0;
    var currentword = "";
    var char = "";

    return new Promise(() => {
      var loop = () => {
        this.generate_char(sentence).then((char_index) => {
          char = this.indices_char[char_index];
          sentence = sentence.substr(1) + char;

          tmp++;

          if (tmp == this.switch_interval) { // sentenceを交換する時になったら、sentenceを新しい配列に交換し、currentwordを空にして、処理を中断する。
            tmp = 0;
            sentence = this.text.substr(Math.floor(Math.random() * (this.text.length - this.maxlen)), this.maxlen);
            currentword = "";
            loop();
            return;
          }

          if (char == "\n") { // 改行コードが出てきたら、currentwordを空にする。
            if (currentword != "") { // さらに条件が合えば、currentwordを送信する。
              self.postMessage({
                type: "word",
                data: currentword
              });
            }
            currentword = ""
          } else { // 改行コードが出てこなかったら、現在生成中の単語に生成された文字を加える。
            currentword += char;
          }

          loop();
        });
      }
      loop();
    });
  }
}

var obj = undefined; // LSTMBaseオブジェクト。

self.addEventListener('message', function(message) {
  if (message.data.type == 'start') {
    obj = new LSTMBase(message.data.data);
  }
});
