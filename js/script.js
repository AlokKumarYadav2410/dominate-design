const state = {
    elements: [],
    selectedId: null
};

let rectangle = document.querySelector('#rectangle');
let circle = document.querySelector('#circle');
let imageInput = document.querySelector('#image-input');
let deleteBtn = document.querySelector('#delete');
let canvas = document.getElementById('canvas');

let textBtn = document.querySelector('#text');


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
