const {app, BrowserWindow} = require('electron')

var mainWindows = null

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })
  mainWindow.loadURL(`file://${__dirname}/resource/index.html`)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
})