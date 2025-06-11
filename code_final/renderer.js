let mediaRecorder;
let recordedChunks = [];

// Check if electronAPI is available
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  console.log('electronAPI available:', !!window.electronAPI);
  
  if (!window.electronAPI) {
    alert('electronAPI not available. Check preload script.');
    return;
  }
  
  console.log('electronAPI methods:', Object.keys(window.electronAPI));
});

document.getElementById('start-btn').onclick = async () => {
  try {
    console.log('Start button clicked');
    
    // Check if electronAPI is available
    if (!window.electronAPI || !window.electronAPI.getSources) {
      throw new Error('electronAPI.getSources is not available');
    }
    
    console.log('Calling getSources...');
    const sources = await window.electronAPI.getSources();
    console.log('Sources received:', sources);
    
    if (!sources || sources.length === 0) {
      alert('No sources available for recording');
      return;
    }
    
    const source = sources[0];
    console.log('Using source:', source.name);

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
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      try {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = window.electronAPI.Buffer.from(arrayBuffer);
        const filePath = await window.electronAPI.saveDialog();

        if (filePath) {
          await window.electronAPI.writeFile(filePath, buffer);
          alert(`Recording saved successfully to: ${filePath}`);
        } else {
          alert('Save cancelled');
        }

        recordedChunks = [];
      } catch (error) {
        console.error('Error saving recording:', error);
        alert('Error saving recording: ' + error.message);
      }
    };

    mediaRecorder.start();
    document.getElementById('start-btn').disabled = true;
    document.getElementById('stop-btn').disabled = false;
    
  } catch (error) {
    console.error('Error starting recording:', error);
    alert('Error starting recording: ' + error.message);
  }
};

document.getElementById('stop-btn').onclick = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    
    // Stop all tracks to release the stream
    const stream = document.getElementById('preview').srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }
  
  document.getElementById('start-btn').disabled = false;
  document.getElementById('stop-btn').disabled = true;
};