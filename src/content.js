// content.js
// This script runs automatically on each page load
function isPdfPage() {
  // Check if the page is a PDF
  return window.location.href.toLowerCase().includes('.pdf') || 
         document.querySelector('embed[type="application/pdf"]') !== null ||
         // Google Drive PDF viewer detection
         (window.location.href.includes('drive.google.com') && 
          document.querySelector('.ndfHFb-c4YZDc-cYSp0e-DARUcf')) ||
         // Google Classroom potential PDF viewer
         (window.location.href.includes('classroom.google.com') && 
          document.querySelector('iframe[src*="drive.google.com"]'));
}

// Create a button that will be shown on PDF pages
function createFloatingButton() {
  // Check if button already exists
  if (document.getElementById('pdf-inverter-floating-btn')) {
    return;
  }
  
  const button = document.createElement('button');
  button.id = 'pdf-inverter-floating-btn';
  button.textContent = 'Invert PDF Colors';
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;
  
  button.addEventListener('click', togglePdfInvert);
  document.body.appendChild(button);
}

function togglePdfInvert() {
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
      
      /* Additional selectors for PDF.js (used by Chrome) */
      .textLayer, 
      .canvasWrapper, 
      .pdfViewer .page, 
      .pdfViewer .textLayer,
      .pdfViewer .canvasWrapper {
        filter: invert(100%) hue-rotate(180deg) !important;
      }
      
      /* Make sure text remains readable */
      .textLayer > span, 
      .textLayer > div {
        color: inherit !important;
      }
      
      /* Google Drive PDF viewer support */
      .ndfHFb-c4YZDc-cYSp0e-DARUcf,
      .ndfHFb-c4YZDc-GSQQnc-LgbsSe {
        filter: invert(100%) hue-rotate(180deg) !important;
      }
      
      /* Support for iframe-embedded PDFs */
      iframe[src*=".pdf"] {
        filter: invert(100%) hue-rotate(180deg) !important;
      }
      
      /* Invert images back to normal so they look correct */
      .pdfViewer img {
        filter: invert(100%) hue-rotate(180deg) !important;
      }
    `;
    document.head.appendChild(newStyle);
  }
}

// Check if this is a PDF page and add the floating button if it is
window.addEventListener('load', () => {
  // Give a short delay to make sure PDF is loaded
  setTimeout(() => {
    if (isPdfPage()) {
      createFloatingButton();
    }
    
    // Try to handle iframes that might contain PDFs
    handleIframes();
  }, 1000);
});

// Handle dynamic PDF loading and iframe additions
const observer = new MutationObserver(() => {
  if (isPdfPage() && !document.getElementById('pdf-inverter-floating-btn')) {
    createFloatingButton();
  }
  
  // Check for newly added iframes
  handleIframes();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Handle iframes that might contain PDFs
function handleIframes() {
  const iframes = document.querySelectorAll('iframe');
  
  iframes.forEach(iframe => {
    try {
      // Try to access iframe content if from same origin
      if (iframe.contentDocument) {
        // Apply floating button to iframe if it's a PDF
        if (iframe.src.includes('.pdf')) {
          createFloatingButtonInIframe(iframe);
        }
      }
    } catch (e) {
      // Cross-origin iframe, can't access directly
      console.log('PDF Inverter: Cross-origin iframe detected');
    }
  });
}

function createFloatingButtonInIframe(iframe) {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Check if button already exists in iframe
    if (iframeDoc.getElementById('pdf-inverter-floating-btn')) {
      return;
    }
    
    const button = iframeDoc.createElement('button');
    button.id = 'pdf-inverter-floating-btn';
    button.textContent = 'Invert PDF Colors';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      cursor: pointer;
      font-family: Arial, sans-serif;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    button.addEventListener('click', () => togglePdfInvertInIframe(iframe));
    iframeDoc.body.appendChild(button);
  } catch (e) {
    console.error('Cannot access iframe content due to same-origin policy', e);
  }
}

function togglePdfInvertInIframe(iframe) {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const style = iframeDoc.getElementById('pdf-inverter-style');
    
    if (style) {
      style.remove();
    } else {
      const newStyle = iframeDoc.createElement('style');
      newStyle.id = 'pdf-inverter-style';
      newStyle.textContent = `
        /* PDF inversion for iframe */
        body, embed[type="application/pdf"], object[type="application/pdf"] {
          filter: invert(100%) hue-rotate(180deg) !important;
        }
      `;
      iframeDoc.head.appendChild(newStyle);
    }
  } catch (e) {
    console.error('Cannot modify iframe content due to same-origin policy', e);
    // Apply inversion to the iframe element itself as fallback
    if (iframe.style.filter.includes('invert')) {
      iframe.style.filter = '';
    } else {
      iframe.style.filter = 'invert(100%) hue-rotate(180deg)';
    }
  }
}