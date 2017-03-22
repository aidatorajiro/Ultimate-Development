var webFrame = require('electron').webFrame;
webFrame.setZoomLevelLimits(1, 1);

Main = {};

Main.addWordChoiceModule = function (args) {
    
    var choice_module = document.createElement('div');
    choice_module.setAttribute('class', 'choice');
    document.getElementById('wrapper').appendChild(choice_module);
    
    var worker = undefined;
    
    var start_worker = function () { // workerを新しく作動させる。すでにworkerがある場合は停止させた上で作動させる。
        if (worker == undefined) {
            worker = new Worker('lstm_base_worker.js');
        } else {
            worker.terminate();
            worker = new Worker('lstm_base_worker.js');
        }
        
        worker.postMessage(
        { type: 'start', 
          data: { model: 'model_data/' + args.type + '/model_' + args.level + '.json', 
                  weights: 'model_data/' + args.type + '/model_' + args.level + '_weights.buf',
                  metadata: 'model_data/' + args.type + '/model_' + args.level + '_metadata.json',
                  corpus: 'model_data/' + args.type + '/jyukugo.txt',
                  maxlen: args.maxlen,
                  switch_interval: args.switch_interval,
                  diversity: args.diversity } } );
        
        worker.addEventListener('message', function (message) {
            if (message.data.type == 'debug') {
            }
            if (message.data.type == 'word') {
                var elem = document.createElement("a");
                var word = document.createTextNode(message.data.data);
                elem.appendChild(word);
                elem.className = "word";
                choice_module.appendChild(elem);
            }
        });
    }
    
    start_worker();
}

Main.addManowaJyukugoLSTMChoiceModule = function (args) {
    args = Util.extend({type: 'manowa_jyukugo_lstm', maxlen: 40, level: 33, switch_interval: 20, diversity: 5.5}, args);
    Main.addWordChoiceModule(args);
}

Main.addManowaJyukugoLSTMChoiceModule();