// main.js
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('path')
const fs = require('fs')

let win

function createWindow() {
  const { screen } = require('electron')

  win = new BrowserWindow({
    width: 300,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    alwaysOnTop: true
  })

  win.loadFile('index.html')

  const menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Add Folder',
          click() {
            win.webContents.send('show-add-folder')
          }
        },
        {
          label: 'Show Folder List',
          click() {
            win.webContents.send('show-folder-list')
          }
        },
        {
          label: 'Add Timer',
          click() {
            win.webContents.send('show-add-timer')
          }
        },
        {
          label: 'Show Timer List',
          click() {
            win.webContents.send('show-timer-list')
          }
        }
      ]
    }
  ])

  Menu.setApplicationMenu(menu)

  // Send folder data when app is ready
  sendFolderData()
  sendTimerData()
}

function sendFolderData() {
  const jsonPath = path.join(__dirname, 'folders.json')
  let folders = []

  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath)
    folders = JSON.parse(rawData)
  }

  win.webContents.send('folder-data', folders)
}

ipcMain.on('add-folder', (event, folder) => {
  // Check if the path exists
  if (!fs.existsSync(folder.path)) {
    dialog.showMessageBoxSync(win, {
      type: 'warning',
      message: '존재하지 않는 폴더 주소입니다.',
      buttons: ['OK']
    })
    return
  }

  // Save the folder data
  const jsonPath = path.join(__dirname, 'folders.json')
  let folders = []

  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath)
    folders = JSON.parse(rawData)
  }

  // same folder path check
  for (const f of folders) {
    if (f.path == folder.path) {
      dialog.showMessageBoxSync(win, {
        type: 'warning',
        message: '이미 존재하는 폴더 주소입니다.',
        button: ['OK']
      })
      return
    }
  }

  folders.push(folder)
  fs.writeFileSync(jsonPath, JSON.stringify(folders, null, 2))

  // Send the updated folder data
  sendFolderData()
})

ipcMain.on('delete-folders', (event, foldersToDelete) => {
  const jsonPath = path.join(__dirname, 'folders.json')
  let folders = []

  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath)
    folders = JSON.parse(rawData)
  }

  folders = folders.filter(folder => !foldersToDelete.includes(folder.path))
  fs.writeFileSync(jsonPath, JSON.stringify(folders, null, 2))

  // Send the updated folder data
  sendFolderData()
})

function sendTimerData() {
  const jsonPath = path.join(__dirname, 'timers.json')
  let timers = []

  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath)
    timers = JSON.parse(rawData)
  }

  win.webContents.send('timer-data', timers)
}

ipcMain.on('add-timer', (event, timer) => {
  // Save the timer data
  const jsonPath = path.join(__dirname, 'timers.json')
  let timers = []

  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath)
    timers = JSON.parse(rawData)
  }

  for (const t of timers) {
    if (timer.name == t.name) {
      dialog.showMessageBoxSync(win, {
        type: 'warning',
        message: '이미 존재하는 이름입니다.',
        button: ['OK']
      })
      return
    }
  }

  timers.push(timer)
  fs.writeFileSync(jsonPath, JSON.stringify(timers, null, 2))

  // Send the updated timer data
  sendTimerData()
})

ipcMain.on('delete-timers', (event, timersToDelete) => {
  const jsonPath = path.join(__dirname, 'timers.json')
  let timers = []

  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath)
    timers = JSON.parse(rawData)
  }

  timers = timers.filter(timer => !timersToDelete.includes(timer.name))
  fs.writeFileSync(jsonPath, JSON.stringify(timers, null, 2))

  // Send the updated timer data
  sendTimerData()
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
