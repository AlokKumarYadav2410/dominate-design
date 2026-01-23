// ===== STATE MANAGEMENT =====

const state = {
  elements: localStorage.getItem('canvasState') ? JSON.parse(localStorage.getItem('canvasState')).elements : [],
  selectedId: null
};

// DOM References
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
let  loader = document.querySelector('.loader');

// State for drag and resize
let resizeDirection = null;
let startX, startY, startW, startH, startLeft, startTop;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isDragging = false;
let isResizing = false;
let draggedLayer = null;

// Save state to localStorage
function saveState() {
  const safeState = {
    elements: state.elements.filter(el => el.type !== 'image-element')
  };

  localStorage.setItem('canvasState', JSON.stringify(safeState));
}

// Generate unique ID
function generateId() {
  return 'id_' + Date.now();
}
