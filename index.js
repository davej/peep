var electron = require('electron')
var {ipcMain, nativeImage} = electron
var setMenu = require('./appmenu.js')
var menubar = require('menubar')
var path = require('path')
var imageResize = require('electron-image-resize')

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

function setUA (ua) {
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

function setAlwaysOnTop (bool) {
  mb.setOption('always-on-top', bool)
  mb.window.setAlwaysOnTop(bool)
}

ipcMain.on('setAlwaysOnTop:true', () => setAlwaysOnTop(true))
ipcMain.on('setAlwaysOnTop:false', () => setAlwaysOnTop(false))

var useSiteIconAsAppIcon = false
ipcMain.on('useSiteIconAsAppIcon:true', () => {
  useSiteIconAsAppIcon = true
})
ipcMain.on('useSiteIconAsAppIcon:false', () => {
  useSiteIconAsAppIcon = false
  setAsActive()
})

ipcMain.on('setIconToFaviconUrl', (e, favicons) => setIconToFaviconUrl(favicons))

var lastFavicon = null
function setIconToFaviconUrl (favicons) {
  if (!useSiteIconAsAppIcon) return

  var hasValidFavicon = favicons.some(favicon => {
    if (lastFavicon === favicon) {
      // Same icon as last time so do nothing
      return true
    }
    if (favicon.substring(0, 21) === 'data:image/png;base64' || favicon.substr(0, 4) === 'http') {
      // Currently supports urls and data urls
      imageResize({
        url: favicon,
        width: 18,
        height: 18
      }).then(img =>
        mb.tray.setImage(
          nativeImage.createFromBuffer(
            img.toPng(),
            electron.screen.getPrimaryDisplay().scaleFactor
          )
        )
      , err => console.log(err))
      lastFavicon = favicon
      return true
    }
    return false
  })
  if (!hasValidFavicon) setAsActive()
}

mb.on('ready', function ready () {
  setMenu()
  setMobileUA()
})

function setAsActive () {
  mb.tray.setImage(path.join(__dirname, 'tray-icon', 'ActiveIconTemplate.png'))
}
function setAsInactive () {
  mb.tray.setImage(path.join(__dirname, 'tray-icon', 'IconTemplate.png'))
}
mb.on('show', () => !useSiteIconAsAppIcon && setAsActive())
mb.on('hide', () => !useSiteIconAsAppIcon && setAsInactive())
