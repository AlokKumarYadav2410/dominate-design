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
  
  const layerControls = document.createElement('div');
  layerControls.className = 'layer-controls';
  
  const moveUpBtn = document.createElement('i');
  moveUpBtn.className = 'ri-arrow-up-s-line layer-btn';
  moveUpBtn.title = 'Move Up';
  moveUpBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    moveLayerUp(elem.id);
  });
  
  const moveDownBtn = document.createElement('i');
  moveDownBtn.className = 'ri-arrow-down-s-line layer-btn';
  moveDownBtn.title = 'Move Down';
  moveDownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    moveLayerDown(elem.id);
  });
  
  const layerVisibility = document.createElement('i');
  layerVisibility.className = 'ri-eye-line layer-visibility';
  layerVisibility.dataset.visible = 'true';
  
  layerItem.appendChild(layerIcon);
  layerItem.appendChild(layerName);
  layerControls.appendChild(moveUpBtn);
  layerControls.appendChild(moveDownBtn);
  layerControls.appendChild(layerVisibility);
  layerItem.appendChild(layerControls);
  
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

function moveLayerUp(id) {
  const layerItem = layersPanel.querySelector(`[data-id="${id}"]`);
  
  if (layerItem && layerItem.previousElementSibling) {
    layerItem.parentNode.insertBefore(layerItem, layerItem.previousElementSibling);
    updateZIndexFromLayers();
  }
}

function moveLayerDown(id) {
  const layerItem = layersPanel.querySelector(`[data-id="${id}"]`);
  
  if (layerItem && layerItem.nextElementSibling) {
    layerItem.parentNode.insertBefore(layerItem.nextElementSibling, layerItem);
    updateZIndexFromLayers();
  }
}
