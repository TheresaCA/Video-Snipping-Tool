#  Electron Screen Recorder

A basic screen recording application built with **Electron.js** for Windows. This app allows you to capture your entire screen or a specific application window and save the recording to a file.

---

## Features

- Capture full screen.
- Record video using `desktopCapturer` API
- Save recordings in formats like **WebM**

---

## How It Works

- User clicks "Start Recording"
- App gets list of available screens/windows
- User's browser asks for screen capture permission
- MediaRecorder starts capturing video data
- Data is collected in small "chunks"
- User clicks "Stop Recording"
- All chunks are combined into one video file
- User chooses where to save the file
- File is written to disk



---

## Program File Structure

```
your-project/
├── main.js          # Main Electron process (backend)
├── preload.js       # Security bridge between main and renderer
├── renderer.js      # Frontend JavaScript (user interface logic)
├── index.html       # User interface structure
├── style.css        # User interface styling
└── package.json     # Project configuration
```
