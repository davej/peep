var electron = require('electron')
var Menu = electron.Menu
var app = electron.app
var windows = require('./windows')

var template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function () { app.quit() }
      },
      {
        label: 'Open Location',
        accelerator: 'CmdOrCtrl+L',
        click: function (item, focusedWindow) {
          global.mb.window.webContents.send('appmenu', 'file:open-location')
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
          global.mb.window.webContents.send('view:reload')
        }
      },
      {
        label: 'Hard Reload (Clear Cache)',
        accelerator: 'CmdOrCtrl+Shift+R',
        click: function (item, focusedWindow) {
          global.mb.window.webContents.send('view:hard-reload')
        }
      },
      // {
      //   label: 'Toggle Full Screen',
      //   accelerator: (function () {
      //     if (process.platform === 'darwin') return 'Ctrl+Command+F'
      //     return 'F11'
      //   })(),
      //   click: function (item, focusedWindow) {
      //     global.mb.window.setFullScreen(!focusedWindow.isFullScreen())
      //   }
      // },
      {
        label: 'Toggle Developer Tools',
        accelerator: (function () {
          if (process.platform === 'darwin') return 'Alt+Command+I'
          return 'Ctrl+Shift+I'
        })(),
        click: function (item, focusedWindow) {
          global.mb.window.toggleDevTools()
        }
      }
    ]
  },
  {
    label: 'History',
    role: 'history',
    submenu: [
      {
        label: 'Back',
        accelerator: 'CmdOrCtrl+Left',
        click: function (item, focusedWindow) {
          global.mb.window.webContents.send('appmenu', 'history:back')
        }
      },
      {
        label: 'Forward',
        accelerator: 'CmdOrCtrl+Right',
        click: function (item, focusedWindow) {
          global.mb.window.webContents.send('appmenu', 'history:forward')
        }
      }
    ]
  }
]

module.exports = function () {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
