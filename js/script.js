const state = {
    elements: [],
    selectedId: null
};

let rectangle = document.querySelector('#rectangle');
let circle = document.querySelector('#circle');
let imageInput = document.querySelector('#image-input');
let imageBtn = document.querySelector('#image');
let textBtn = document.querySelector('#text');
let deleteBtn = document.querySelector('#delete');
let canvas = document.getElementById('canvas');


imageBtn.addEventListener('click', () => {
    imageInput.click();
});

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

function renderElement(el) {
  const div = document.createElement('div');
  const resizeHandle = document.createElement('div');
  div.dataset.id = el.id;
  div.classList.add(el.type);
  resizeHandle.classList.add('resize');
  div.appendChild(resizeHandle);

  div.style.left = el.x + 'px';
  div.style.top = el.y + 'px';
  div.style.width = el.width + 'px';
  div.style.height = el.height + 'px';
  div.style.zIndex = el.zIndex;

  canvas.appendChild(div);
}

rectangle.addEventListener('click', createRectangle);
circle.addEventListener('click', createCircle);
