const { ipcRenderer } = require('electron');

let mediaRecorder;
let recordedChunks = [];

document.getElementById('start-btn').onclick = async () => {
  const sources = await ipcRenderer.invoke('get-sources');
  const source = sources[0]; // Selecting the first source by default

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
      },
    },
  });

  document.getElementById('preview').srcObject = stream;

  mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

  mediaRecorder.ondataavailable = (event) => {
    recordedChunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const buffer = Buffer.from(await blob.arrayBuffer());

    const { dialog } = require('electron').remote;
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Video',
      defaultPath: 'recording.webm',
    });

    require('fs').writeFile(filePath, buffer, () => {
      console.log('Video saved successfully!');
    });
  };

  mediaRecorder.start();
  document.getElementById('start-btn').disabled = true;
  document.getElementById('stop-btn').disabled = false;
};

document.getElementById('stop-btn').onclick = () => {
  mediaRecorder.stop();
  document.getElementById('start-btn').disabled = false;
  document.getElementById('stop-btn').disabled = true;
};
