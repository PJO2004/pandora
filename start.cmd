python.exe -m pip install -r ./requirements.txt
pyinstaller --onefile --noconsole --add-data "folder_icon.png;." --name FolderHub main.py