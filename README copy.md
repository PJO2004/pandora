배포용 패키지
npm install --save-dev electron-builder

배포
npx electron-builder --publish=never

```
  "build": {
    "productName": "FolderHubJW",
    "appId": "net.jetalab.ex.startelectron",
    "asar": true,
    "mac": {
      "target": [
        "default"
      ]
    },
    "dmg": {
      "title": "FolderHubJW"
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": [
            "x64",
            "ia32"
          ]
        }
      ]
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": false,
      "createDesktopShortcut": true
    },
    "directories": {
      "buildResources": "./resources/installer/",
      "output": "./dist/",
      "app": "."
    }
  },
```