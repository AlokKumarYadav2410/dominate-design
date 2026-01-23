function clampElementToCanvas(elem) {
  const maxX = canvas.clientWidth - elem.width;
  const maxY = canvas.clientHeight - elem.height;

  elem.x = Math.max(0, Math.min(elem.x, maxX));
  elem.y = Math.max(0, Math.min(elem.y, maxY));
}

// Update DOM element position
function updateDOM(elem) {
  const dom = canvas.querySelector(`[data-id="${elem.id}"]`);
  dom.style.left = elem.x + 'px';
  dom.style.top = elem.y + 'px';
}

// Update DOM element size
function updateDOMSize(elem) {
  const dom = canvas.querySelector(`[data-id="${elem.id}"]`);
  dom.style.width = elem.width + 'px';
  dom.style.height = elem.height + 'px';
}

// Color conversion utilities
function rgbToHex(rgb) {
  if (!rgb || rgb === '') return '#ffffff';
  const result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return '#ffffff';
  
  const r = parseInt(result[0]);
  const g = parseInt(result[1]);
  const b = parseInt(result[2]);
  
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 'rgb(200, 200, 200)';
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgb(${r}, ${g}, ${b})`;
}
