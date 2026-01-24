function selectElement(id) {
  clearSelection();
  state.selectedId = id;

  const elem = canvas.querySelector(`[data-id="${id}"]`);
  if (!elem) return;
  elem.classList.add('selected');

  elem.querySelectorAll('.resize-handle').forEach(h => h.remove());
  createResizeHandles(elem);
  
  // Update layers panel
  selectLayerInPanel(id);
  
  // Show properties panel
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
  
  // Deselect in layers panel
  layersPanel.querySelectorAll('.layer-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  // Hide properties panel
  hidePropertiesPanel();
  
  state.selectedId = null;
}

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

function renderElement(el) {
  const div = document.createElement('div');

  div.dataset.id = el.id;
  div.classList.add(el.type);
  div.style.left = el.x + 'px';
  div.style.top = el.y + 'px';
  div.style.width = el.width + 'px';
  div.style.height = el.height + 'px';
  div.style.zIndex = el.zIndex;
  
  // Apply rotation if exists
  if (el.rotation) {
    div.style.transform = `rotate(${el.rotation}deg)`;
  }
  
  // Apply opacity if exists
  if (el.opacity) {
    div.style.opacity = el.opacity / 100;
  }
  
  // Apply background color for rectangles and circles
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

// CANVAS EVENT LISTENERS 

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

// KEYBOARD EVENT HANDLERS
document.addEventListener('keydown', (e) => {
  if (!state.selectedId) return;

  const elem = state.elements.find(el => el.id === state.selectedId);
  if (!elem) return;

  const moveDistance = 5;

  switch (e.key) {
    case 'Delete':
      e.preventDefault();
      deleteSelectedElement();
      break;

    case 'ArrowUp':
      e.preventDefault();
      elem.y = Math.max(0, elem.y - moveDistance);
      clampElementToCanvas(elem);
      updateDOM(elem);
      saveState();
      break;

    case 'ArrowDown':
      e.preventDefault();
      elem.y = Math.min(canvas.clientHeight - elem.height, elem.y + moveDistance);
      clampElementToCanvas(elem);
      updateDOM(elem);
      saveState();
      break;

    case 'ArrowLeft':
      e.preventDefault();
      elem.x = Math.max(0, elem.x - moveDistance);
      clampElementToCanvas(elem);
      updateDOM(elem);
      saveState();
      break;

    case 'ArrowRight':
      e.preventDefault();
      elem.x = Math.min(canvas.clientWidth - elem.width, elem.x + moveDistance);
      clampElementToCanvas(elem);
      updateDOM(elem);
      saveState();
      break;

    default:
      break;
  }
});