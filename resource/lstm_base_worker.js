// model ... modelへのパス 必須
// weights ... weightsへのパス 必須
// metadata ... metadataへのパス 必須
// corpus ... 学習文章へのパス 必須
// switch_interval ... 文章生成時のseedを交換する周期（文字ごと）。0以下で交換しない。
// diversity ... 文章の多様性

importScripts('util.js');
importScripts('keras.js');

debug_log = function (text) {
    self.postMessage({type: "debug", data: text});
}

LSTMBase = function (args) {
    args = Util.extend({switch_interval: 20, diversity: 1}, args);
    
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
    
    
    
    var _this = this;
    
    Util.get_data(args.corpus)
    .then(function (xhr) { _this.text = xhr.responseText ; return 1 ; })
    .then(function () { return _this.pre_process_function(); })
    .then(function () {
        debug_log('Generating words...');
        _this.generate_words();
    });
}

LSTMBase.prototype.pre_process_function = function () {
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
LSTMBase.prototype.generate_char = function (seed) {
    var x = new Float32Array(this.maxlen*this.chars.length);
    for (var k = 0; k != seed.length; k++) {
        x[k*this.chars.length+this.char_indices[seed[k]]] = 1;
    }
    
    var _this = this;
    return this.model.predict({"input": x}).then(function (preds) {
        return Util.sample(preds.output, _this.diversity);
    });
}

LSTMBase.prototype.generate_words = function () {
    var _this = this;
    
    var sentence = this.text.substr(Math.floor(Math.random() * this.text.length), this.maxlen);
    var tmp = 0;
    var currentword = "";
    var char = "";
    
    return new Promise(function () {
        function loop () {
            _this.generate_char(sentence).then(function (char_index) {
                char = _this.indices_char[char_index];
                sentence = sentence.substr(1) + char;
                
                tmp++;
                
                if (tmp == _this.switch_interval) { // sentenceを交換する時になったら、sentenceを新しい配列に交換し、currentwordを空にして、処理を中断する。
                    tmp = 0;
                    sentence = _this.text.substr(Math.floor(Math.random() * (_this.text.length - _this.maxlen)), _this.maxlen);
                    currentword = "";
                    loop();
                    return;
                }
                
                if (char == "\n") { // 改行コードが出てきたら、currentwordを空にする。
                    if ( currentword != "") { // さらに条件が合えば、currentwordを送信する。
                        self.postMessage({type: "word", data: currentword});
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

var obj = undefined; // LSTMBaseオブジェクト。

self.addEventListener('message', function (message) {
    if (message.data.type == 'start') {
        obj = new LSTMBase(message.data.data);
    }
});