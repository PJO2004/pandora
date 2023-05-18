python.exe -m pip install -r ./requirements.txt
pyinstaller --onefile --noconsole --add-data "./data/folder_icon.png;./data/" --name FolderHub main.py
