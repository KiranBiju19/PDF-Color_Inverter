// popup.js
document.getElementById('toggleInvert').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Check if this is a PDF file
  if (tab.url.includes('.pdf') || document.querySelector('embed[type="application/pdf"]')) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: togglePdfInvert
      });
      document.getElementById('status').textContent = 'Colors toggled!';
    } catch (err) {
      document.getElementById('status').textContent = 'Error: ' + err.message;
    }
  } else {
    document.getElementById('status').textContent = 'This is not a PDF page.';
  }
});

function togglePdfInvert() {
  // This function will be injected into the page
  const style = document.getElementById('pdf-inverter-style');
  
  if (style) {
    // Style exists, so remove it to toggle off
    style.remove();
  } else {
    // Style doesn't exist, so add it to toggle on
    const newStyle = document.createElement('style');
    newStyle.id = 'pdf-inverter-style';
    newStyle.textContent = `
      /* For Chrome's PDF viewer */
      embed[type="application/pdf"],
      #viewer,
      .pdfViewer,
      .page {
        filter: invert(100%) hue-rotate(180deg) !important;
      }
      
      /* Invert images back to normal */
      img {
        filter: invert(100%) hue-rotate(180deg) !important;
      }
    `;
    document.head.appendChild(newStyle);
  }
}
