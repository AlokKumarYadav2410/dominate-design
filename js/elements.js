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

function deleteSelectedElement() {
  if (!state.selectedId) return;

  state.elements = state.elements.filter(el => el.id !== state.selectedId);

  const elemDOM = canvas.querySelector(`[data-id="${state.selectedId}"]`);
  if (elemDOM) {
    elemDOM.remove();
  }
  
  // Remove from layers panel
  removeLayerFromPanel(state.selectedId);

  saveState();
  state.selectedId = null;
}
