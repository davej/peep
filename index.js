var electron = require('electron')
var { ipcMain } = electron
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
  transparent: true,
  webPreferences: {
    experimentalFeatures: true
  }
})
global.mb = mb


function setUA(ua) {
  electron.session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = ua
    callback({ cancel: false, requestHeaders: details.requestHeaders })
  })
}

var mobileUA = `Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/${process.versions.chrome} Mobile Safari/537.36`
var setMobileUA = () => setUA(mobileUA)
var desktopUA = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36`
var setDesktopUA = () => setUA(desktopUA)

ipcMain.on('setUA:mobile', () => setMobileUA())
ipcMain.on('setUA:desktop', () => setDesktopUA())

function setAlwaysOnTop(bool) {
  mb.setOption('always-on-top', bool)
  mb.window.setAlwaysOnTop(bool)
}

ipcMain.on('setAlwaysOnTop:true', () => setAlwaysOnTop(true))
ipcMain.on('setAlwaysOnTop:false', () => setAlwaysOnTop(false))

mb.on('ready', function ready () {
  setMenu()
  setMobileUA()
})

mb.on('show', () => {
  mb.tray.setImage(path.join(__dirname, 'tray-icon', 'ActiveIconTemplate.png'))
})

mb.on('hide', () => {
  mb.tray.setImage(path.join(__dirname, 'tray-icon', 'IconTemplate.png'))
})
