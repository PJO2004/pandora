import sys
import os
import json
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QLineEdit, QLabel, QVBoxLayout, QWidget, QHBoxLayout
from PyQt5.QtGui import QIcon
from PyQt5.QtCore import Qt

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Folder Hub")
        self.setGeometry(100, 100, 1000, 800)

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

        self.folder_icon = QIcon("folder_icon.png")

        self.load_folder_data()

    def add_button_clicked(self):
        folder_name = self.name_input.text()
        folder_path = self.path_input.text()
        if folder_name and folder_path:
            abs_folder_path = os.path.abspath(folder_path)
            self.folder_data.append((folder_name, abs_folder_path))

            folder_layout = QHBoxLayout()
            folder_layout.setAlignment(Qt.AlignLeft)

            folder_icon_label = QLabel()
            folder_icon_label.setPixmap(self.folder_icon.pixmap(30, 30))

            folder_label = QLabel(folder_name)
            folder_label.setStyleSheet("QLabel { color: blue; text-decoration: underline; }")
            folder_label.setCursor(Qt.PointingHandCursor)
            folder_label.mousePressEvent = lambda event: self.open_folder(abs_folder_path)

            folder_layout.addWidget(folder_icon_label)
            folder_layout.addWidget(folder_label)

            self.folders_layout.addLayout(folder_layout)

            self.name_input.clear()
            self.path_input.clear()

            self.save_folder_data()

    def open_folder(self, folder_path):
        os.startfile(folder_path)

    def save_folder_data(self):
        with open("folder_data.json", "w") as f:
            json.dump(self.folder_data, f)

    def load_folder_data(self):
        try:
            with open("folder_data.json", "r") as f:
                self.folder_data = json.load(f)
        except FileNotFoundError:
            self.folder_data = []

        for folder_name, folder_path in self.folder_data:
            folder_layout = QHBoxLayout()
            folder_layout.setAlignment(Qt.AlignLeft)

            folder_icon_label = QLabel()
            folder_icon_label.setPixmap(self.folder_icon.pixmap(30, 30))

            folder_label = QLabel(folder_name)
            folder_label.setStyleSheet("QLabel { color: blue; text-decoration: underline; }")
            folder_label.setCursor(Qt.PointingHandCursor)
            folder_label.mousePressEvent = lambda event: self.open_folder(folder_path)

            folder_layout.addWidget(folder_icon_label)
            folder_layout.addWidget(folder_label)

            self.folders_layout.addLayout(folder_layout)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())