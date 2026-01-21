const state = {
    elements: [],
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

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        const base64Image = e.target.result;
        imageUpload(base64Image);

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

    if (el.type === 'image-element' && el.styles.imageSrc) {
        const img = document.createElement('img');
        img.src = el.styles.imageSrc;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.pointerEvents = 'none';
        div.appendChild(img);
    }
    canvas.appendChild(div);
}




