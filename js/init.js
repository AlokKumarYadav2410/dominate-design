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

// Image upload handler
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

// Initialize from saved state
state.elements.forEach(elem => renderElement(elem));

// Initialize layers from saved state
state.elements.forEach(elem => addLayerToPanel(elem));
updateLayersPanelVisibility();
