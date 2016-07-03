var electron = require('electron')
var windows = require('./windows.js')
var setMenu = require('./appmenu.js')
var menubar = require('menubar')
var path = require('path')

var mb = menubar({
  dir: __dirname,
  icon: path.join(__dirname, 'tray-icon', 'IconTemplate.png'),
  preloadWindow: true,
  width: 400,
  height: 400,
  minWidth: 400,
  minHeight: 300,
  maxWidth: 400,
  maxHeight: 1000,
  // 'always-on-top': true,
  transparent: true,
  webPreferences: {
    experimentalFeatures: true
  }
})
global.mb = mb

mb.on('ready', function ready () {
  setMenu()
  electron.session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    var ua = `Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/${process.versions.chrome} Mobile Safari/537.36`
    details.requestHeaders['User-Agent'] = ua
    callback({ cancel: false, requestHeaders: details.requestHeaders })
  })
})

mb.on('show', () => {
  mb.tray.setImage(path.join(__dirname, 'tray-icon', 'ActiveIconTemplate.png'))
})

mb.on('hide', () => {
  mb.tray.setImage(path.join(__dirname, 'tray-icon', 'IconTemplate.png'))
})
