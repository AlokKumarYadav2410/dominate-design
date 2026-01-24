# 🎨 Dominate Design

A powerful, intuitive browser-based design application for creating and editing visual layouts. Dominate Design allows you to create, manipulate, and manage design elements with an intuitive interface featuring a canvas editor, layers panel, and properties inspector.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)

## ✨ Features

### Core Design Tools
- **Rectangle & Circle Elements** - Create basic shapes with customizable dimensions and styling
- **Text Editor** - Add and format text elements directly on the canvas
- **Image Support** - Upload and place images with drag-and-drop functionality
- **Real-time Canvas Editing** - Drag, resize, and position elements seamlessly

### Advanced Layer Management
- **Layers Panel** - Visual hierarchy of all design elements
- **Z-Index Control** - Move layers up/down to control stacking order with intuitive buttons
- **Element Visibility Toggle** - Show/hide layers with a single click
- **Drag-to-Reorder** - Rearrange layers by dragging them in the panel

### Properties Inspector
- **Dimension Control** - Set precise width and height values
- **Position Adjustment** - Control exact X and Y coordinates
- **Styling Options** - 
  - Background color with color picker
  - Border radius for rounded corners
  - Opacity/transparency control
  - Rotation angles
- **Real-time Updates** - All property changes reflect instantly on the canvas

### File Management
- **JSON Export** - Save your design as a JSON file for future editing
- **HTML Export** - Export your design as a standalone HTML file
- **Local Storage** - Auto-save designs to browser storage
- **Design Persistence** - Your work is automatically saved between sessions

## 🎯 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or build tools required - pure vanilla JavaScript

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlokKumarYadav2410/dominate-design
   cd dominate
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser

3. **Start designing**
   - Click the toolbar icons to add elements
   - Use the canvas to position and resize
   - Manage layers in the left panel
   - Adjust properties on the right

## 🎮 Usage

### Creating Elements

| Tool | Shortcut | Description |
|------|----------|-------------|
| Rectangle | Click icon | Create rectangular shapes |
| Circle | Click icon | Create circular shapes |
| Text | Click icon | Add text content |
| Image | Click icon | Upload and place images |

### Manipulating Elements

- **Select** - Click any element on the canvas to select it
- **Move** - Drag selected element to reposition
- **Resize** - Use handles on the corners/edges of selected element
- **Delete** - Select element and click the delete icon in toolbar
- **Properties** - Edit values in the properties panel on the right

### Managing Layers

- **Reorder** - Use ⬆️ **Up** and ⬇️ **Down** buttons in the layers panel
- **Toggle Visibility** - Click the 👁️ **eye icon** to show/hide layers
- **Select** - Click any layer to select the corresponding element

### Exporting

- **JSON Export** - Save editable design file for later modifications
- **HTML Export** - Create a static HTML file of your final design

## 📁 Project Structure

```
dominate/
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Main stylesheet
│   ├── theme.css          # Color and spacing variables
│   ├── responsive.css     # Mobile responsiveness
│   └── loader.css         # Loading animation styles
├── js/
│   ├── state.js           # Global state management
│   ├── utils.js           # Utility functions
│   ├── elements.js        # Element creation logic
│   ├── canvas.js          # Canvas interactions
│   ├── layers.js          # Layers panel management
│   ├── properties.js      # Properties panel management
│   ├── export.js          # Export functionality
│   └── init.js            # Application initialization
├── assets/                # Images and icons
└── Reference/             # Documentation
```

## 🏗️ Architecture

### Modular JavaScript Structure

**state.js** - Core state management and DOM references
- Global state object with elements array
- Storage of selected element ID
- All DOM element references

**utils.js** - Helper and utility functions
- Canvas boundary clamping
- DOM updates and animations
- Color conversion utilities

**elements.js** - Element creation and manipulation
- Rectangle, circle, text, and image creation
- Element deletion with cleanup
- Element rendering on canvas

**canvas.js** - Canvas interactions and controls
- Element selection and highlighting
- Drag-to-move functionality
- Resize operations with handles
- Canvas event management

**layers.js** - Layers panel management
- Layer item creation and removal
- Drag-to-reorder layers
- Z-index management
- Visibility toggling

**properties.js** - Properties panel management
- Dynamic property input generation
- Real-time property updates
- Color picker integration
- Property value bindings

**export.js** - Export functionality
- JSON serialization
- HTML generation
- File download management

## 🎨 Customization

### Theme Colors
Edit `css/theme.css` to customize the color scheme:

```css
:root {
  --bg-primary-color: rgb(30, 30, 30);
  --bg-secondary-color: rgb(43, 43, 43);
  --bg-active-color: rgb(233, 233, 233);
  /* ... more variables ... */
}
```

### Layout Adjustments
- Panel widths in `css/style.css`
- Responsive breakpoints in `css/responsive.css`
- Animation timings in individual CSS files

## 🛠️ Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Supported |
| Firefox | Latest | ✅ Supported |
| Safari | Latest | ✅ Supported |
| Edge | Latest | ✅ Supported |

## 💾 Local Storage

Designs are automatically saved to your browser's local storage. To clear saved designs:
- Open browser DevTools (F12)
- Go to Application > Local Storage
- Find and delete the `canvasState` entry

## 🚀 Performance Tips

- Limit the number of elements to 50+ for optimal performance
- Use PNG images for better compression
- Clear unused layers regularly
- Export and reimport for large projects

## 🐛 Known Limitations

- Designs are stored locally in browser; clearing browser data will remove unsaved designs
- Export functionality is browser-based (requires download support)
- Very large images may impact performance
- Undo/Redo functionality not yet implemented

## 🔄 Future Enhancements

- [ ] Undo/Redo functionality
- [ ] Grid and snap-to-grid
- [ ] Multi-select elements
- [ ] Grouping elements
- [ ] Shape libraries and presets
- [ ] Collaborative editing
- [ ] Cloud storage integration
- [ ] Animation timeline
- [ ] Advanced text formatting
- [ ] Custom shapes and paths

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📧 Support

For support, feature requests, or bug reports, please create an issue in the repository.

---

**Made with ❤️ by the Alok Kumar Yadav**
