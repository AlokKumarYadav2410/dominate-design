function showPropertiesPanel(id) {
  const elem = state.elements.find(el => el.id === id);
  if (!elem) return;
  
  selectionMessage.classList.add('hidden');
  propertiesPanel.innerHTML = '';
  
  // Initialize opacity if not set
  if (!elem.opacity) {
    elem.opacity = 100;
  }
  
  // Width and Height for all types
  addPropertyInput('width', 'Width:', elem.width, (value) => {
    elem.width = Math.max(20, parseInt(value));
    updateDOMSize(elem);
    saveState();
  });
  
  addPropertyInput('height', 'Height:', elem.height, (value) => {
    elem.height = Math.max(20, parseInt(value));
    updateDOMSize(elem);
    saveState();
  });
  
  // Color property for all types
  addPropertyColorInput('color', 'Color:', elem.styles.backgroundColor || elem.styles.color || '#ffffff', (value) => {
    if (elem.type === 'text') {
      elem.styles.color = value;
      const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
      const span = domElem?.querySelector('span');
      if (span) span.style.color = value;
    } else {
      elem.styles.backgroundColor = value;
      const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
      if (domElem) {
        domElem.style.backgroundColor = value;
      }
    }
    saveState();
  });
  
  // Rotation for all types
  addPropertyInput('rotation', 'Rotation:', elem.rotation || 0, (value) => {
    elem.rotation = parseInt(value) % 360;
    const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
    if (domElem) {
      domElem.style.transform = `rotate(${elem.rotation}deg)`;
    }
    saveState();
  }, 'range', 0, 360, 'deg');
  
  // Opacity for all types
  addPropertyInput('opacity', 'Opacity:', elem.opacity, (value) => {
    elem.opacity = parseInt(value);
    const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
    if (domElem) {
      domElem.style.opacity = parseInt(value) / 100;
    }
    saveState();
  }, 'range', 0, 100, '%');
  
  // Type-specific properties for TEXT
  if (elem.type === 'text') {
    addPropertyInput('text-content', 'Text:', elem.styles.text, (value) => {
      elem.styles.text = value;
      const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
      const span = domElem?.querySelector('span');
      if (span) span.textContent = value;
      saveState();
    }, 'text');
    
    addPropertyInput('font-size', 'Font Size (px):', elem.styles.fontSize || 16, (value) => {
      elem.styles.fontSize = parseInt(value);
      const domElem = canvas.querySelector(`[data-id="${elem.id}"]`);
      const span = domElem?.querySelector('span');
      if (span) span.style.fontSize = elem.styles.fontSize + 'px';
      saveState();
    });
  }
}

function hidePropertiesPanel() {
  selectionMessage.classList.remove('hidden');
  propertiesPanel.innerHTML = '';
}

function addPropertyInput(id, label, value, onChange, type = 'number', min = '0', max = '100', unit = '') {
  const label_el = document.createElement('label');
  label_el.htmlFor = id;
  label_el.className = 'property-label';
  
  const labelText = document.createElement('span');
  labelText.textContent = label;
  
  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.value = value;
  input.className = 'property-input';
  
  if (type === 'range') {
    input.min = min;
    input.max = max;

    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'range-value';
    valueDisplay.textContent = unit ? `${value} ${unit}` : value;

    input.addEventListener('input', (e) => {
      valueDisplay.textContent = unit ? `${e.target.value} ${unit}` : e.target.value;
      onChange(e.target.value);
    });

    const row = document.createElement('div');
    row.className = 'property-row';
    row.appendChild(labelText);
    row.appendChild(valueDisplay);

    label_el.appendChild(row);
    label_el.appendChild(input);
  } else {
    input.min = min;
    input.addEventListener('input', (e) => onChange(e.target.value));
    
    label_el.appendChild(labelText);
    label_el.appendChild(input);
  }
  
  propertiesPanel.appendChild(label_el);
}

function addPropertyColorInput(id, label, value, onChange) {
  const label_el = document.createElement('label');
  label_el.htmlFor = id;
  label_el.className = 'property-label';
  
  const labelText = document.createElement('span');
  labelText.textContent = label;
  
  const input = document.createElement('input');
  input.type = 'color';
  input.id = id;
  input.value = rgbToHex(value) || '#ffffff';
  input.className = 'property-input color-picker';
  
  input.addEventListener('input', (e) => onChange(hexToRgb(e.target.value)));
  
  label_el.appendChild(labelText);
  label_el.appendChild(input);
  
  propertiesPanel.appendChild(label_el);
}
