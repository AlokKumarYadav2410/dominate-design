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

rectangle.addEventListener('click', createRectangle);
circle.addEventListener('click', createCircle);
textBtn.addEventListener('click', createText);

imageBtn.addEventListener('click', () => {
  imageInput.click();
});

deleteBtn.addEventListener('click', deleteSelectedElement);

state.elements.forEach(elem => renderElement(elem));

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
    styles: {
      backgroundColor: '',
      text: '',
      imageSrc: ''
    },
    zIndex: state.elements.length + 1
  };

  state.elements.push(element);
  renderElement(element);
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
}

canvas.addEventListener('click', (e) => {
  const target = e.target.closest('[data-id]');

  if (!target || !canvas.contains(target)) {
    clearSelection();
    return;
  }

  selectElement(target.dataset.id);
});

function selectElement(id) {
  clearSelection();
  state.selectedId = id;

  const elem = document.querySelector(`[data-id="${id}"]`);
  elem.classList.add('selected');

  elem.querySelectorAll('.resize-handle').forEach(h => h.remove());
  createResizeHandles(elem);
}

function clearSelection() {
  if (!state.selectedId) return;

  const elem = document.querySelector(`[data-id="${state.selectedId}"]`);

  elem?.classList.remove('selected');
  elem?.querySelectorAll('.resize-handle').forEach(h => h.remove());
  state.selectedId = null;
}

function deleteSelectedElement() {
  if (!state.selectedId) return;

  state.elements = state.elements.filter(el => el.id !== state.selectedId);

  const elemDOM = canvas.querySelector(`[data-id="${state.selectedId}"]`);
  if (elemDOM) {
    elemDOM.remove();
  }

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
  if (!target) return;

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
    saveState();
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
  saveState();
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  isResizing = false;
  resizeDirection = null;
});

function updateDOM(elem) {
  const dom = document.querySelector(`[data-id="${elem.id}"]`);
  dom.style.left = elem.x + 'px';
  dom.style.top = elem.y + 'px';
}

function updateDOMSize(elem) {
  const dom = document.querySelector(`[data-id="${elem.id}"]`);
  dom.style.width = elem.width + 'px';
  dom.style.height = elem.height + 'px';
}

function renderElement(el) {
  const div = document.createElement('div');

  div.dataset.id = el.id;
  div.classList.add(el.type);
  div.style.left = el.x + 'px';
  div.style.top = el.y + 'px';
  div.style.width = el.width + 'px';
  div.style.height = el.height + 'px';
  div.style.zIndex = el.zIndex;

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
    span.style.fontSize = el.styles.fontSize + 'px';
    span.style.color = el.styles.color;
    span.style.fontFamily = el.styles.fontFamily;
    span.style.fontWeight = el.styles.fontWeight;
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

  saveState();
  canvas.appendChild(div);
}

function clampElementToCanvas(elem) {
  const maxX = canvas.clientWidth - elem.width;
  const maxY = canvas.clientHeight - elem.height;

  elem.x = Math.max(0, Math.min(elem.x, maxX));
  elem.y = Math.max(0, Math.min(elem.y, maxY));
}

function saveState() {
  const safeState = {
    elements: state.elements.filter(el => el.type !== 'image-element')
  };

  localStorage.setItem('canvasState', JSON.stringify(safeState));
}