let rectangle = document.querySelector('#rectangle');
let circle = document.querySelector('#circle');
let imageInput = document.querySelector('#image-input');
let deleteBtn = document.querySelector('#delete');
let canvas = document.getElementById('canvas');

rectangle.addEventListener('click', () => {
    let rect = document.createElement('div');
    rect.classList.add('rectangle');
    canvas.appendChild(rect);
})

circle.addEventListener('click', () => {
    let circ = document.createElement('div');
    circ.classList.add('circle');
    canvas.appendChild(circ);
    elements.push(circ);
})

imageInput.addEventListener('change', (event) => {
    let file = event.target.files[0];
    let img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    const div = document.createElement('div');
    div.classList.add('image-element');
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    // img.style.borderRadius = '8px';
    img.style.pointerEvents = 'none';
    img.style.position = 'center';
    div.appendChild(img);
    canvas.appendChild(div);
})
