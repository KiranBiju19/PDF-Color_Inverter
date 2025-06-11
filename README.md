# PDF Color Inverter Chrome Extension

> A lightweight Chrome Extension that allows users to toggle color inversion on PDF files for reduced eye strain, especially during late-night reading sessions.

## 🚀 Features

- Detects PDF files on active tabs
- Adds a floating button on the screen for quick toggle
- Inverts colors using `filter: invert(100%) hue-rotate(180deg)`
- Supports embedded PDF viewers (Google Drive, Classroom, etc.)
- User-friendly popup UI with toggle button

## 📂 Project Structure
├── - content.js # Injected into all web pages, handles PDF detection and color inversion
├── - popup.html # Extension popup interface
├── - popup.js # Logic to toggle color inversion from popup
├── - manifest.json # Chrome Extension manifest (v3)
├── - icon16.png # Icon for the extension


## 🧠 How It Works

The extension scans the page to detect embedded or direct PDF viewers. Once detected, it provides an "Invert PDF Colors" button, enabling/disabling a CSS filter to invert document colors.

## 🛠️ Installation (Developer Mode)

1. Clone this repo
2. Go to `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the project folder
5. Open any PDF file to test!


## 🧑‍💻 Built With

- JavaScript
- HTML/CSS

## 🙋‍♂️ Author

Made with 💡 by [Kiran Biju](https://github.com/your-github-profile)

---

🔗 **Have suggestions? Want to contribute?** Feel free to raise an issue or submit a PR.
