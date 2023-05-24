// main.js
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('path')
const fs = require('fs')

let win

function createWindow () {
  const { screen } = require('electron')
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  win = new BrowserWindow({
    // width: width * 0.8, // 현재 화면의 80% 크기로 설정
    // height: height * 0.8,
    width: 300,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    alwaysOnTop: true,
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
}

function sendFolderData() {
  const jsonPath = path.join(__dirname, './data/folders.json')
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
      message: 'The path does not exist',
      buttons: ['OK']
    })
    return
  }

  // Save the folder data
  const jsonPath = path.join(__dirname, './data/folders.json')
  let folders = []

  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath)
    folders = JSON.parse(rawData)
  }

  folders.push(folder)
  fs.writeFileSync(jsonPath, JSON.stringify(folders, null, 2))

  // Send the updated folder data
  sendFolderData()
})

ipcMain.on('delete-folders', (event, foldersToDelete) => {
  const jsonPath = path.join(__dirname, './data/folders.json')
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

// timer
function sendTimerData() {
  const jsonPath = path.join(__dirname, './data/timers.json')
  let timers = []
  
  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath)
    timers = JSON.parse(rawData)
  }
  win.webContents.send('timer-data', timers)
}

ipcMain.on('add-timer', (event, timer) => {
  // Save the timer data
  const jsonPath = path.join(__dirname, './data/timers.json')
  let timers = []
  
  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath)
    timers = JSON.parse(rawData)
  }
  
  timers.push(timer)
  fs.writeFileSync(jsonPath, JSON.stringify(timers, null, 2))

  // send the updated timer data
  sendTimerData()
})

// Call sendTimerData when the app is ready
app.whenReady().then(() => {
  sendTimerData()
})
