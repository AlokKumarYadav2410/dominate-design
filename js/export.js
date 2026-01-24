function exportAsJSON() {
  if (state.elements.length === 0) {
    alert('No elements to export');
    return;
  }

  const exportData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    elements: state.elements
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dominate-design-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportAsHTML() {
  if (state.elements.length === 0) {
    alert('No elements to export');
    return;
  }

  const canvasWidth = canvas?.clientWidth || 1200;
  const canvasHeight = canvas?.clientHeight || 700;

  const defaultRectColor = 'rgba(38, 142, 38, 0.3)';
  const defaultCircleColor = 'rgba(0, 190, 204, 0.3)';
  const defaultTextColor = 'rgb(200, 200, 200)';

  let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dominate Design Export</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: #1a1a1a;
            font-family: Arial, sans-serif;
        }
          h1, p{
            color: #eee;
          }
        .canvas {
            position: relative;
          width: ${canvasWidth}px;
          height: ${canvasHeight}px;
          background-color: #1c1c1f;
            border: 1px solid #444;
        }
        .element {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <h1>Dominate Design Export</h1>
    <p>Exported on: ${new Date().toLocaleString()}</p>
    <div class="canvas">
`;

  const sortedElements = [...state.elements].sort((a, b) => a.zIndex - b.zIndex);

  sortedElements.forEach(elem => {
    let elementHTML = `<div class="element" style="`;

    elementHTML += `left: ${elem.x}px; top: ${elem.y}px; width: ${elem.width}px; height: ${elem.height}px; z-index: ${elem.zIndex}; `;
    elementHTML += `opacity: ${(elem.opacity ?? 100) / 100}; `;

    if (elem.rotation) {
      elementHTML += `transform: rotate(${elem.rotation}deg); `;
    }
    if (elem.type === 'rectangle') {
      elementHTML += `background-color: ${elem.styles.backgroundColor || defaultRectColor}; `;
    }
    if (elem.type === 'circle') {
      elementHTML += `background-color: ${elem.styles.backgroundColor || defaultCircleColor}; `;
    }
    if (elem.type === 'circle') {
      elementHTML += `border-radius: 50%; `;
    }

    elementHTML += `"`;
    elementHTML += ` class="element ${elem.type}"`;
    elementHTML += `>`;

    if (elem.type === 'text') {
      const textColor = elem.styles.color || defaultTextColor;
      const fontSize = elem.styles.fontSize || 16;
      const fontFamily = elem.styles.fontFamily || 'Arial';
      const fontWeight = elem.styles.fontWeight || 'normal';

      elementHTML += `<span style="color: ${textColor}; font-size: ${fontSize}px; font-family: ${fontFamily}; font-weight: ${fontWeight}; text-align: center;">${escapeHtml(elem.styles.text)}</span>`;
    } else if (elem.type === 'image-element' && elem.styles.imageSrc) {
      elementHTML += `<img src="${elem.styles.imageSrc}" style="width: 100%; height: 100%; object-fit: cover;" alt="Image">`;
    }

    elementHTML += `</div>\n`;
    htmlContent += elementHTML;
  });

  htmlContent += `</div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `design-${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Utility to escape HTML special characters
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
