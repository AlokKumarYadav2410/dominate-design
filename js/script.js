const state = {
  elements: localStorage.getItem('canvasState') ? JSON.parse(localStorage.getItem('canvasState')).elements : [],
  selectedId: null
};

let rectangle = document.querySelector('#rectangle');
let circle = document.querySelector('#circle');
let textBtn = document.querySelector('#text');
let imageInput = document.querySelector('#image-input');
let imageBtn = document.querySelector('#image');
let deleteBtn = document.querySelector('#delete');
let canvas = document.getElementById('canvas');
let layersPanel = document.querySelector('.layers-list');
let propertiesPanel = document.querySelector('.properties-list');
let selectionMessage = document.querySelector('.selection');
let noLayersMessage = document.querySelector('.no-layers');
let loader = document.querySelector('.loader');

setTimeout(() => {
    loader.classList.add('hidden');
}, 2000)

rectangle.addEventListener('click', createRectangle);
circle.addEventListener('click', createCircle);
textBtn.addEventListener('click', createText);

imageBtn.addEventListener('click', () => {
  imageInput.click();
});

deleteBtn.addEventListener('click', deleteSelectedElement);

state.elements.forEach(elem => renderElement(elem));

// Initialize layers from saved state
state.elements.forEach(elem => addLayerToPanel(elem));
updateLayersPanelVisibility();

let resizeDirection = null;
let startX, startY, startW, startH, startLeft, startTop;

function generateId() {
  return 'id_' + Date.now();
}

function createRectangle() {
  const width = 120;
  const height = 120;

  const x = (canvas.clientWidth - width) / 2;
  const y = (canvas.clientHeight - height) / 2;
  const element = {
    id: generateId(),
    type: 'rectangle',
    x: x,
    y: y,
    width: width,
    height: height,
    rotation: 0,
    opacity: 100,
    styles: {
      backgroundColor: '',
      text: '',
      imageSrc: ''
    },
    zIndex: state.elements.length + 1
  };

  state.elements.push(element);
  renderElement(element);
  addLayerToPanel(element);
  updateLayersPanelVisibility();
}

function createCircle() {
  const width = 120;
  const height = 120;

  const x = (canvas.clientWidth - width) / 2;
  const y = (canvas.clientHeight - height) / 2;

  const element = {
    id: generateId(),
    type: 'circle',
    x: x,
    y: y,
    width: width,
    height: height,
    rotation: 0,
    opacity: 100,
    styles: {
      backgroundColor: '',
      borderRadius: '',
      text: '',
      imageSrc: ''
    },
    zIndex: state.elements.length + 1
  };

  state.elements.push(element);
  renderElement(element);
  addLayerToPanel(element);
  updateLayersPanelVisibility();
}

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const base64Image = e.target.result;
    imageUpload(base64Image);
    imageInput.value = '';
  }

  reader.readAsDataURL(file);
});

function imageUpload(imageSrc) {
  const width = 120;
  const height = 120;

  const x = (canvas.clientWidth - width) / 2;
  const y = (canvas.clientHeight - height) / 2;

  const element = {
    id: generateId(),
    type: 'image-element',
    x: x,
    y: y,
    width: width,
    height: height,
    rotation: 0,
    opacity: 100,
    styles: {
      backgroundColor: '',
      borderRadius: '',
      text: '',
      imageSrc: imageSrc
    },
    zIndex: state.elements.length + 1
  };

  state.elements.push(element);
  renderElement(element);
  addLayerToPanel(element);
  updateLayersPanelVisibility();
}

function createText() {
  const width = 200;
  const height = 50;
  const x = (canvas.clientWidth - width) / 2;
  const y = (canvas.clientHeight - height) / 2;

  const element = {
    id: generateId(),
    type: 'text',
    x: x,
    y: y,
    width: width,
    height: height,
    rotation: 0,
    opacity: 100,
    styles: {
      backgroundColor: '',
      text: 'New Text',
      fontSize: 16,
      color: 'rgb(200, 200, 200)',
      fontFamily: 'Arial',
      fontWeight: 'normal'
    },
    zIndex: state.elements.length + 1
  };

  state.elements.push(element);
  renderElement(element);
  addLayerToPanel(element);
  updateLayersPanelVisibility();
}

function selectElement(id) {
  clearSelection();
  state.selectedId = id;

  const elem = canvas.querySelector(`[data-id="${id}"]`);
  if (!elem) return;
  elem.classList.add('selected');

  elem.querySelectorAll('.resize-handle').forEach(h => h.remove());
  createResizeHandles(elem);
  
  selectLayerInPanel(id);
  
  showPropertiesPanel(id);
}

function clearSelection() {
  if (state.selectedId) {
    const elem = canvas.querySelector(`[data-id="${state.selectedId}"]`);
    if (elem) {
      elem.classList.remove('selected');
      elem.querySelectorAll('.resize-handle').forEach(h => h.remove());
    }
  }
  
  layersPanel.querySelectorAll('.layer-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  hidePropertiesPanel();
  
  state.selectedId = null;
}

function deleteSelectedElement() {
  if (!state.selectedId) return;

  state.elements = state.elements.filter(el => el.id !== state.selectedId);

  const elemDOM = canvas.querySelector(`[data-id="${state.selectedId}"]`);
  if (elemDOM) {
    elemDOM.remove();
  }
  
  removeLayerFromPanel(state.selectedId);

  saveState();
  state.selectedId = null;
}

let dragOffsetX = 0;
let dragOffsetY = 0;
let isDragging = false;
let isResizing = false;

function createResizeHandles(elementDiv) {
  const directions = ['tl', 'tr', 'bl', 'br'];

  directions.forEach(dir => {
    const handle = document.createElement('div');
    handle.className = `resize-handle ${dir}`;
    handle.dataset.direction = dir;

    handle.addEventListener('mousedown', resizeMouseDown);
    elementDiv.appendChild(handle);
  });
}

function resizeMouseDown(e) {
  e.stopPropagation();

  const dir = e.target.dataset.direction;
  resizeDirection = dir;
  isResizing = true;

  const elem = state.elements.find(el => el.id === state.selectedId);

  startX = e.clientX;
  startY = e.clientY;
  startW = elem.width;
  startH = elem.height;
  startLeft = elem.x;
  startTop = elem.y;
}

canvas.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('resize-handle')) return;

  const target = e.target.closest('[data-id]');
  if (!target) {
    clearSelection();
    return;
  }

  selectElement(target.dataset.id);

  const elem = state.elements.find(el => el.id === target.dataset.id);
  isDragging = true;

  dragOffsetX = e.clientX - elem.x;
  dragOffsetY = e.clientY - elem.y;
});

document.addEventListener('mousemove', (e) => {
  if (isResizing && state.selectedId) {
    const elem = state.elements.find(el => el.id === state.selectedId);

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (resizeDirection.includes('r')) {
      elem.width = Math.max(20, startW + dx);
    }
    if (resizeDirection.includes('l')) {
      elem.width = Math.max(20, startW - dx);
      elem.x = startLeft + dx;
    }
    if (resizeDirection.includes('b')) {
      elem.height = Math.max(20, startH + dy);
    }
    if (resizeDirection.includes('t')) {
      elem.height = Math.max(20, startH - dy);
      elem.y = startTop + dy;
    }

    clampElementToCanvas(elem);
    updateDOM(elem);
    updateDOMSize(elem);
    return;
  }

  if (!isDragging || !state.selectedId) return;

  const elem = state.elements.find(
    el => el.id === state.selectedId
  );

  elem.x = e.clientX - dragOffsetX;
  elem.y = e.clientY - dragOffsetY;

  clampElementToCanvas(elem);
  updateDOM(elem);
});

document.addEventListener('mouseup', () => {
  if (isDragging || isResizing) {
    saveState();
  }
  isDragging = false;
  isResizing = false;
  resizeDirection = null;
});

function renderElement(el) {
  const div = document.createElement('div');

  div.dataset.id = el.id;
  div.classList.add(el.type);
  div.style.left = el.x + 'px';
  div.style.top = el.y + 'px';
  div.style.width = el.width + 'px';
  div.style.height = el.height + 'px';
  div.style.zIndex = el.zIndex;
  
  if (el.rotation) {
    div.style.transform = `rotate(${el.rotation}deg)`;
  }
  
  if (el.opacity) {
    div.style.opacity = el.opacity / 100;
  }
  
  if ((el.type === 'rectangle' || el.type === 'circle') && el.styles.backgroundColor) {
    div.style.backgroundColor = el.styles.backgroundColor;
  }

  if (el.type === 'image-element' && el.styles.imageSrc) {
    const img = document.createElement('img');
    img.src = el.styles.imageSrc;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.pointerEvents = 'none';
    div.appendChild(img);
  }
  
  if (el.type === 'text') {
    const span = document.createElement('span');
    span.textContent = el.styles.text;
    span.style.fontSize = (el.styles.fontSize || 16) + 'px';
    span.style.color = el.styles.color || 'rgb(200, 200, 200)';
    span.style.fontFamily = el.styles.fontFamily || 'Arial';
    span.style.fontWeight = el.styles.fontWeight || 'normal';
    span.style.display = 'flex';
    span.style.alignItems = 'center';
    span.style.justifyContent = 'center';
    span.style.width = '100%';
    span.style.height = '100%';
    span.style.textAlign = 'center';

    div.addEventListener('dblclick', () => {
      if (el.type === 'text') {
        const newText = prompt('Edit text:', el.styles.text);
        if (newText !== null) {
          el.styles.text = newText;
          div.querySelector('span').textContent = newText;
          saveState();
        }
      }
    });
    div.appendChild(span);
  }

  canvas.appendChild(div);
  saveState();
}

function clampElementToCanvas(elem) {
  const maxX = canvas.clientWidth - elem.width;
  const maxY = canvas.clientHeight - elem.height;

  elem.x = Math.max(0, Math.min(elem.x, maxX));
  elem.y = Math.max(0, Math.min(elem.y, maxY));
}

function updateDOM(elem) {
  const dom = canvas.querySelector(`[data-id="${elem.id}"]`);
  dom.style.left = elem.x + 'px';
  dom.style.top = elem.y + 'px';
}

function updateDOMSize(elem) {
  const dom = canvas.querySelector(`[data-id="${elem.id}"]`);
  dom.style.width = elem.width + 'px';
  dom.style.height = elem.height + 'px';
}

function saveState() {
  const safeState = {
    elements: state.elements.filter(el => el.type !== 'image-element')
  };

  localStorage.setItem('canvasState', JSON.stringify(safeState));
}

// LAYERS PANEL FUNCTIONS
function addLayerToPanel(elem) {
  const layerItem = document.createElement('div');
  layerItem.className = 'layer-item';
  layerItem.dataset.id = elem.id;
  
  const layerIcon = document.createElement('span');
  layerIcon.className = 'layer-icon';
  layerIcon.innerHTML = getElementIcon(elem.type);
  
  const layerName = document.createElement('span');
  layerName.className = 'layer-name';
  layerName.textContent = elem.type.charAt(0).toUpperCase() + elem.type.slice(1);
  
  const layerVisibility = document.createElement('i');
  layerVisibility.className = 'ri-eye-line layer-visibility';
  layerVisibility.dataset.visible = 'true';
  
  layerItem.appendChild(layerIcon);
  layerItem.appendChild(layerName);
  layerItem.appendChild(layerVisibility);
  
  // Click to select
  layerItem.addEventListener('click', (e) => {
    e.stopPropagation();
    selectElement(elem.id);
  });
  
  // Visibility toggle
  layerVisibility.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = layerVisibility.dataset.visible === 'true';
    const elemDOM = canvas.querySelector(`[data-id="${elem.id}"]`);
    
    if (isVisible) {
      elemDOM.style.display = 'none';
      layerVisibility.className = 'ri-eye-off-line layer-visibility';
      layerVisibility.dataset.visible = 'false';
    } else {
      elemDOM.style.display = 'block';
      layerVisibility.className = 'ri-eye-line layer-visibility';
      layerVisibility.dataset.visible = 'true';
    }
  });
  
  // Drag to reorder
  layerItem.draggable = true;
  layerItem.addEventListener('dragstart', handleLayerDragStart);
  layerItem.addEventListener('dragover', handleLayerDragOver);
  layerItem.addEventListener('drop', handleLayerDrop);
  layerItem.addEventListener('dragend', handleLayerDragEnd);
  
  layersPanel.appendChild(layerItem);
}

function getElementIcon(type) {
  const icons = {
    'rectangle': '<i class="ri-rectangle-line"></i>',
    'circle': '<i class="ri-checkbox-blank-circle-line"></i>',
    'text': '<i class="ri-text"></i>',
    'image-element': '<i class="ri-image-fill"></i>'
  };
  return icons[type] || '<i class="ri-shape-line"></i>';
}

function removeLayerFromPanel(id) {
  const layerItem = layersPanel.querySelector(`[data-id="${id}"]`);
  if (layerItem) {
    layerItem.remove();
  }
  updateLayersPanelVisibility();
}

function updateLayersPanelVisibility() {
  if (state.elements.length === 0) {
    noLayersMessage.classList.remove('hidden');
  } else {
    noLayersMessage.classList.add('hidden');
  }
}

function selectLayerInPanel(id) {
  layersPanel.querySelectorAll('.layer-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  const layerItem = layersPanel.querySelector(`[data-id="${id}"]`);
  if (layerItem) {
    layerItem.classList.add('selected');
  }
}

// Drag and drop for layers
let draggedLayer = null;

function handleLayerDragStart(e) {
  draggedLayer = this;
  this.classList.add('dragging');
}

function handleLayerDragOver(e) {
  e.preventDefault();
  if (draggedLayer && draggedLayer !== this) {
    this.parentNode.insertBefore(draggedLayer, this);
  }
}

function handleLayerDrop(e) {
  e.preventDefault();
}

function handleLayerDragEnd(e) {
  this.classList.remove('dragging');
  updateZIndexFromLayers();
}

function updateZIndexFromLayers() {
  const layerItems = layersPanel.querySelectorAll('.layer-item');
  layerItems.forEach((item, index) => {
    const elem = state.elements.find(el => el.id === item.dataset.id);
    if (elem) {
      elem.zIndex = index + 1;
      const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
      if (domElem) {
        domElem.style.zIndex = index + 1;
      }
    }
  });
  saveState();
}

// PROPERTIES PANEL FUNCTIONS 
function showPropertiesPanel(id) {
  const elem = state.elements.find(el => el.id === id);
  if (!elem) return;
  
  selectionMessage.classList.add('hidden');
  propertiesPanel.innerHTML = '';
  
  if (!elem.opacity) {
    elem.opacity = 100;
  }
  
  addPropertyInput('width', 'Width:', elem.width, (value) => {
    elem.width = Math.max(20, parseInt(value));
    updateDOMSize(elem);
    saveState();
  });
  
  addPropertyInput('height', 'Height:', elem.height, (value) => {
    elem.height = Math.max(20, parseInt(value));
    updateDOMSize(elem);
    saveState();
  });
  
  addPropertyColorInput('color', 'Color:', elem.styles.backgroundColor || elem.styles.color || '#ffffff', (value) => {
    if (elem.type === 'text') {
      elem.styles.color = value;
      const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
      const span = domElem?.querySelector('span');
      if (span) span.style.color = value;
    } else {
      elem.styles.backgroundColor = value;
      const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
      if (domElem) {
        domElem.style.backgroundColor = value;
      }
    }
    saveState();
  });
  
  addPropertyInput('rotation', 'Rotation:', elem.rotation || 0, (value) => {
    elem.rotation = parseInt(value) % 360;
    const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
    if (domElem) {
      domElem.style.transform = `rotate(${elem.rotation}deg)`;
    }
    saveState();
  }, 'range', 0, 360);
  
  addPropertyInput('opacity', 'Opacity:', elem.opacity, (value) => {
    elem.opacity = parseInt(value);
    const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
    if (domElem) {
      domElem.style.opacity = parseInt(value) / 100;
    }
    saveState();
  }, 'range', 0, 100);
  
  // Type-specific properties for TEXT
  if (elem.type === 'text') {
    addPropertyInput('text-content', 'Text:', elem.styles.text, (value) => {
      elem.styles.text = value;
      const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
      const span = domElem?.querySelector('span');
      if (span) span.textContent = value;
      saveState();
    }, 'text');
    
    addPropertyInput('font-size', 'Font Size (px):', elem.styles.fontSize || 16, (value) => {
      elem.styles.fontSize = parseInt(value);
      const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
      const span = domElem?.querySelector('span');
      if (span) span.style.fontSize = elem.styles.fontSize + 'px';
      saveState();
    });
  }
}

function hidePropertiesPanel() {
  selectionMessage.classList.remove('hidden');
  propertiesPanel.innerHTML = '';
}

function addPropertyInput(id, label, value, onChange, type = 'number', min = '0', max = '100') {
  const label_el = document.createElement('label');
  label_el.htmlFor = id;
  label_el.className = 'property-label';
  
  const labelText = document.createElement('span');
  labelText.textContent = label;
  
  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.value = value;
  input.className = 'property-input';
  
  if (type === 'range') {
    input.min = min;
    input.max = max;
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'range-value';
    valueDisplay.textContent = value;
    
    input.addEventListener('input', (e) => {
      valueDisplay.textContent = e.target.value;
      onChange(e.target.value);
    });
    
    label_el.appendChild(labelText);
    label_el.appendChild(input);
    label_el.appendChild(valueDisplay);
  } else {
    input.min = min;
    input.addEventListener('input', (e) => onChange(e.target.value));
    
    label_el.appendChild(labelText);
    label_el.appendChild(input);
  }
  
  propertiesPanel.appendChild(label_el);
}

function addPropertyColorInput(id, label, value, onChange) {
  const label_el = document.createElement('label');
  label_el.htmlFor = id;
  label_el.className = 'property-label';
  
  const labelText = document.createElement('span');
  labelText.textContent = label;
  
  const input = document.createElement('input');
  input.type = 'color';
  input.id = id;
  input.value = rgbToHex(value) || '#ffffff';
  input.className = 'property-input color-picker';
  
  input.addEventListener('input', (e) => onChange(hexToRgb(e.target.value)));
  
  label_el.appendChild(labelText);
  label_el.appendChild(input);
  
  propertiesPanel.appendChild(label_el);
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