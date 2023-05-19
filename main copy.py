import sys
import os
import json
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QLineEdit, QLabel, QVBoxLayout, QWidget, QHBoxLayout, QMessageBox, QMenuBar, QMenu, QAction
from PyQt5.QtGui import QIcon
from PyQt5.QtCore import Qt

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Folder Hub")
        self.setGeometry(100, 100, 400, 500)

        # 창을 다른 창들 위에 고정
        self.setWindowFlag(Qt.WindowStaysOnTopHint)

        self.folder_data = []

        self.name_input = QLineEdit(self)
        self.name_input.setPlaceholderText("Enter folder name")

        self.path_input = QLineEdit(self)
        self.path_input.setPlaceholderText("Enter folder path")

        self.add_button = QPushButton("Add Folder", self)
        self.add_button.clicked.connect(self.add_button_clicked)

        self.folders_layout = QVBoxLayout()
        self.folders_layout.setAlignment(Qt.AlignTop)
        self.folders_widget = QWidget()
        self.folders_widget.setLayout(self.folders_layout)

        main_layout = QVBoxLayout()
        main_layout.addWidget(self.name_input)
        main_layout.addWidget(self.path_input)
        main_layout.addWidget(self.add_button)
        main_layout.addWidget(self.folders_widget)

        central_widget = QWidget()
        central_widget.setLayout(main_layout)
        self.setCentralWidget(central_widget)

        self.web_icon = QIcon("./data/web_icon.png")
        self.folder_icon = QIcon("./data/folder_icon.png")
        self.delete_icon = QIcon("./data/delete_icon.png")  # delete 버튼 아이콘 설정

        # 메뉴바 설정
        self.menu_bar = QMenuBar(self)
        self.folder_menu = QMenu("Folders", self)
        self.web_menu = QMenu("Web", self)
        self.menu_bar.addMenu(self.folder_menu)
        self.menu_bar.addMenu(self.web_menu)
        self.setMenuBar(self.menu_bar)

        self.load_folder_data()

    def add_button_clicked(self):
        folder_name = self.name_input.text()
        folder_path = self.path_input.text()
        if folder_name and folder_path:
            abs_folder_path = os.path.abspath(folder_path)
            self.folder_data.append({"name": folder_name, "path": abs_folder_path})

            folder_layout = QHBoxLayout()
            folder_layout.setAlignment(Qt.AlignLeft)

            folder_icon_label = QLabel()
            folder_icon_label.setPixmap(self.folder_icon.pixmap(30, 30))

            folder_label = QLabel(folder_name)
            folder_label.setStyleSheet("QLabel { color: blue; text-decoration: underline; }")
            folder_label.setCursor(Qt.PointingHandCursor)
            folder_label.mousePressEvent = lambda event, path=abs_folder_path: self.open_folder(path)

            delete_button = QPushButton()  # delete 아이콘으로 변경
            delete_button.setIcon(self.delete_icon)
            delete_button.clicked.connect(lambda _, path=abs_folder_path: self.delete_folder(path))

            folder_layout.addWidget(folder_icon_label)
            folder_layout.addWidget(folder_label)
            folder_layout.addWidget(delete_button)

            self.folders_layout.addLayout(folder_layout)

            self.name_input.clear()
            self.path_input.clear()

            self.save_folder_data()

    def open_folder(self, folder_path):
        os.startfile(folder_path)

    def delete_folder(self, folder_path):
        reply = QMessageBox.question(self, "Delete Folder", "Are you sure you want to delete this folder?",
                                     QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
        if reply == QMessageBox.Yes:
            self.remove_folder_from_data(folder_path)
            self.reload_folder_data()

    def remove_folder_from_data(self, folder_path):
        for i, folder in enumerate(self.folder_data):
            if folder["path"] == folder_path:
                del self.folder_data[i]
                self.save_folder_data()
                break

    def save_folder_data(self):
        with open("./data/folder_data.json", "w") as f:
            json.dump(self.folder_data, f)

    def load_folder_data(self):
        try:
            with open("./data/folder_data.json", "r") as f:
                self.folder_data = json.load(f)
        except FileNotFoundError:
            self.folder_data = []

        for folder in self.folder_data:
            folder_layout = QHBoxLayout()
            folder_layout.setAlignment(Qt.AlignLeft)

            folder_icon_label = QLabel()
            folder_icon_label.setPixmap(self.folder_icon.pixmap(30, 30))

            folder_label = QLabel(folder["name"])
            folder_label.setStyleSheet("QLabel { color: blue; text-decoration: underline; }")
            folder_label.setCursor(Qt.PointingHandCursor)
            folder_label.mousePressEvent = lambda event, path=folder["path"]: self.open_folder(path)

            delete_button = QPushButton("Delete")
            delete_button.clicked.connect(lambda _, path=folder["path"]: self.delete_folder(path))

            folder_layout.addWidget(folder_icon_label)
            folder_layout.addWidget(folder_label)
            folder_layout.addWidget(delete_button)

            self.folders_layout.addLayout(folder_layout)

    def reload_folder_data(self):
        self.clear_folders_ui()
        self.load_folder_data()

    def clear_folders_ui(self):
        while self.folders_layout.count() > 0:
            item = self.folders_layout.takeAt(0)
            if item.layout():
                self.clear_layout(item.layout())
            elif item.widget():
                item.widget().deleteLater()

    def clear_layout(self, layout):
        while layout.count() > 0:
            item = layout.takeAt(0)
            if item.layout():
                self.clear_layout(item.layout())
            elif item.widget():
                item.widget().deleteLater()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
