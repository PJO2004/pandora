// 
const isElectron = require('electron-is').renderer();

// app main
if (isElectron) {
    const { ipcRenderer, shell } = require('electron');
    
    window.ipcRenderer = ipcRenderer;
    window.shell = shell;
    
    // folder function
    function populateFolderList(folders) {
        const folderList = document.getElementById('folderList');
        folderList.innerHTML = '';

        for (const folder of folders) {
            // create variable
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            const icon = document.createElement('span');
            const link = document.createElement('a');
            const iconImage = document.createElement('img');

            // list item sort
            listItem.style.display = "flex";

            // delete checkbox
            checkbox.type = 'checkbox';
            checkbox.value = folder.path;
            listItem.appendChild(checkbox);
            
            // folder icon
            icon.appendChild(iconImage); // Append img element to the icon span
            iconImage.src = `./data/icon/${folder.color}.jpg`;
            iconImage.alt = 'Folder Icon';
            listItem.appendChild(icon);
            
            // folder path link
            link.textContent = folder.name;
            link.href = '#';
            link.style.padding = '4px';
            link.addEventListener('click', function(e) {
                e.preventDefault();
                shell.openPath(folder.path);
            })

            // content add
            listItem.appendChild(link);
            folderList.appendChild(listItem);
        }
    }

    // timer function
    function populateTimerList(timers) {
        const timerList = document.getElementById('timerList');
        timerList.innerHTML = '';

        for (const timer of timers) {
            // create variable
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            const nameSpan = document.createElement('span');
            const dateSpan = document.createElement('span');
            const today = new Date();
            const userday = new Date(timer.date);
            const daysTime = Math.abs(
                today.getTimer() - userday.getTime()               
            );
            const days = Meth.ceil(daysTime / (1000 * 60 * 60 * 24))

            // dalete checkbox
            checkbox.type = 'checkbox';
            checkbox.value = timer.name;
            listItem.appendChild(checkbox);

            // timer text
            nameSpan.textContent = `[${timer.name}][${timer.date}] : `;
            listItem.appendChild(nameSpan);

            // timer date
            dateSpan.textContent = `${days}일`;

            // content add
            listItem.appendChild(dateSpan);
            timerList.appendChild(listItem);
        }
    }

    // folder code
    document.getElementById('addButtonFolder').addEventListener('click', function() {
        const folderName = document.getElementById('folderName').value;
        const folderPath = document.getElementById('folderPath').value;
        const folderIconColor = document.getElementById('folderIconColor').value;

        ipcRenderer.send('add-folder', 
            { name: folderName, path: folderPath, color: folderIconColor } // json content
        );
    })
    document.getElementById('deleteButtonFolder').addEventListener('click', function() {
        const checkboxes = document.querySelectorAll(
            '#folderList input[type="checkbox"]:checked'
        );
        const foldersToDelete = [];

        for (const checkbox of checkboxes) {
            foldersToDelete.push(checkbox.value);
        };

        ipcRenderer.send('delete-folders', foldersToDelete);
    })

    ipcRenderer.on('folder-data', (event, folders) => {
        populateFolderList(folders);
    })

    // timer code
    document.getElementById('addButtonTimer').addEventListener('click', function() {
        const timerName = document.getElementById('timerName').value;
        const timerDate = document.getElementById('timerDate').value;

        ipcRenderer.send('add-timer', 
            { name: timerName, date: timerDate } // json content
        );
    })
    document.getElementById('deleteButtonTimer').addEventListener('click', function() {
        const checkboxes = document.querySelectorAll(
            '#timerList input[type="checkbox"]:checked'
        )
        const timersToDelete = []
        
        for (const checkbox of checkboxes) {
            timersToDelete.push(checkbox.value)
        }

        ipcRenderer.send('delete-timers', timersToDelete)
    })

    ipcRenderer.on('timer-data', (event, timers) => {
        populateTimerList(timers)
    })

    // display
    ipcRenderer.on('show-add-folder', () => {
        document.getElementById('createArea').style.display = 'block'
        document.getElementById('listAreaFolder').style.display = 'none'
        document.getElementById('timerArea').style.display = 'none'
        document.getElementById('listAreaTimer').style.display = 'none'
    })

    ipcRenderer.on('show-folder-list', () => {
        document.getElementById('createArea').style.display = 'none'
        document.getElementById('listAreaFolder').style.display = 'block'
        document.getElementById('timerArea').style.display = 'none'
        document.getElementById('listAreaTimer').style.display = 'none'
    })

    ipcRenderer.on('show-add-timer', () => {
        document.getElementById('createArea').style.display = 'none'
        document.getElementById('listAreaFolder').style.display = 'none'
        document.getElementById('timerArea').style.display = 'block'
        document.getElementById('listAreaTimer').style.display = 'none'
    })

    ipcRenderer.on('show-timer-list', () => {
        document.getElementById('createArea').style.display = 'none'
        document.getElementById('listAreaFolder').style.display = 'none'
        document.getElementById('timerArea').style.display = 'none'
        document.getElementById('listAreaTimer').style.display = 'block'
    })
}