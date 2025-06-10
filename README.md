# 🎥 Electron Screen Recorder

A basic screen recording application built with **Electron.js** for Windows. This app allows you to capture your entire screen or a specific application window and save the recording to a file.

---

## ✅ Features

- Capture full screen or individual windows
- Record video using `desktopCapturer` API
- Save recordings in formats like **MP4** or **WebM**
- Cross-platform potential (currently focused on Windows)

---

## 🚀 How It Works

This project uses Electron’s built-in `desktopCapturer` API to access screen contents. Recordings are handled by the **MediaRecorder API**, and optionally converted to MP4 using `ffmpeg`.

---

## 🛠️ Tech Stack

- [Electron.js](https://www.electronjs.org/)
- HTML/CSS/JavaScript
- MediaRecorder API
- (Optional) ffmpeg for format conversion

---
