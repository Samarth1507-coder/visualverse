# DrawingCanvas Component

A comprehensive HTML5 Canvas-based drawing board component for the VisualVerse DSA learning platform. This component provides a full-featured drawing experience with responsive design for both desktop and mobile devices.

## 🎨 Features

### Core Drawing Features
- **Freehand Drawing**: Smooth pen tool with customizable brush sizes
- **Eraser Tool**: Remove drawn content with precision
- **Color Selection**: 15 predefined colors + custom color picker
- **Brush Sizes**: 8 different brush sizes (1px to 20px)
- **Clear Canvas**: One-click canvas clearing
- **Save as Image**: Export drawings as PNG files

### Responsive Design
- **Mobile Optimized**: Touch-friendly interface with finger drawing support
- **Desktop Enhanced**: Mouse and tablet support
- **Adaptive Layout**: Toolbar adjusts to screen size
- **Cross-Device**: Works on phones, tablets, and desktops

### User Experience
- **Intuitive Interface**: Clean, modern toolbar design
- **Visual Feedback**: Active tool highlighting and hover effects
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized rendering and smooth drawing experience

## 🚀 Usage

### Basic Implementation

```jsx
import DrawingCanvas from './components/DrawingCanvas';

function App() {
  const handleSave = (imageData) => {
    console.log('Drawing saved:', imageData);
    // Handle the saved image data
  };

  return (
    <DrawingCanvas
      width={800}
      height={600}
      initialColor="#000000"
      initialBrushSize={3}
      onSave={handleSave}
      className="my-drawing-canvas"
    />
  );
}
```

### Advanced Implementation

```jsx
import DrawingCanvas from './components/DrawingCanvas';

function DrawingStudio() {
  const [savedImages, setSavedImages] = useState([]);

  const handleSave = (imageData) => {
    const newImage = {
      id: Date.now(),
      data: imageData,
      timestamp: new Date().toISOString(),
      name: `Drawing-${Date.now()}`
    };
    
    setSavedImages(prev => [...prev, newImage]);
    
    // Save to backend
    saveDrawingToServer(newImage);
  };

  return (
    <div className="drawing-studio">
      <DrawingCanvas
        width={1024}
        height={768}
        initialColor="#3B82F6"
        initialBrushSize={5}
        onSave={handleSave}
        className="studio-canvas"
      />
      
      {/* Gallery of saved images */}
      <div className="saved-images">
        {savedImages.map(image => (
          <img 
            key={image.id} 
            src={image.data} 
            alt={image.name}
            className="saved-image"
          />
        ))}
      </div>
    </div>
  );
}
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `800` | Canvas width in pixels |
| `height` | `number` | `600` | Canvas height in pixels |
| `initialColor` | `string` | `'#000000'` | Initial drawing color (hex format) |
| `initialBrushSize` | `number` | `3` | Initial brush size in pixels |
| `onSave` | `function` | `undefined` | Callback function called when drawing is saved |
| `className` | `string` | `''` | Additional CSS classes for styling |

## 🎯 Component Structure

```
DrawingCanvas/
├── Toolbar
│   ├── Drawing Tools (Pen, Eraser)
│   ├── Brush Size Selector
│   ├── Color Palette
│   └── Action Buttons (Undo, Redo, Clear, Save)
├── Canvas Container
│   └── HTML5 Canvas Element
└── Mobile Instructions (conditional)
```

## 🛠 Technical Implementation

### Canvas Initialization
- Responsive sizing based on container dimensions
- High-DPI support for crisp rendering
- Touch event handling for mobile devices
- Proper cleanup on component unmount

### Drawing Engine
- Smooth line rendering with `lineCap: 'round'`
- Real-time position calculation for mouse/touch
- Efficient event handling with `useCallback`
- State management for drawing tools

### Responsive Design
- CSS Grid and Flexbox for layout
- Media queries for mobile optimization
- Touch-friendly button sizing (44px minimum)
- Adaptive toolbar layout

## 📱 Mobile Support

### Touch Events
- `touchstart`, `touchmove`, `touchend` event handling
- Prevents default touch behaviors (scrolling, zooming)
- Optimized for finger drawing accuracy

### Responsive Features
- Collapsible toolbar on small screens
- Stacked layout for mobile devices
- Touch-friendly color palette
- Mobile-specific instructions

## 🎨 Color Palette

The component includes 15 predefined colors:

```javascript
const colorPalette = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#008000', // Dark Green
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#808080', // Gray
  '#FFD700'  // Gold
];
```

## 🖌 Brush Sizes

Available brush sizes for different drawing needs:

```javascript
const brushSizes = [1, 2, 3, 5, 8, 12, 16, 20];
```

## 🔧 Customization

### Styling
The component uses Tailwind CSS classes and includes a dedicated CSS file (`DrawingCanvas.css`) for additional styling:

```css
/* Custom styles for the drawing canvas */
.drawing-canvas-container {
  /* Your custom styles */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  /* Mobile-specific styles */
}
```

### Extending Functionality
The component is designed to be easily extensible:

```jsx
// Add new tools
const [tool, setTool] = useState('pen'); // Add: 'rectangle', 'circle', 'text'

// Add new brush types
const [brushType, setBrushType] = useState('solid'); // Add: 'dashed', 'dotted'

// Add layers support
const [layers, setLayers] = useState([]);
```

## 🧪 Testing

The component includes comprehensive tests covering:

- Component rendering
- Tool selection
- Color and brush size changes
- Save functionality
- Mobile responsiveness
- Accessibility features

Run tests with:
```bash
npm test DrawingCanvas.test.js
```

## 🚀 Performance Optimizations

### Rendering
- Canvas context caching with `useRef`
- Efficient event handling with `useCallback`
- Minimal re-renders with proper state management

### Memory Management
- Proper cleanup of event listeners
- Canvas context disposal
- Image data optimization

### Mobile Performance
- Touch event throttling
- Reduced canvas resolution on small screens
- Optimized brush rendering

## 🔮 Future Enhancements

### Planned Features
- **Undo/Redo Stack**: Full implementation with canvas state management
- **Shape Tools**: Rectangle, circle, line tools
- **Text Tool**: Add text annotations
- **Layers**: Multi-layer drawing support
- **Export Options**: SVG, JPEG, PDF export
- **Collaboration**: Real-time collaborative drawing
- **Templates**: Pre-made DSA diagram templates

### Advanced Features
- **Vector Graphics**: SVG-based drawing engine
- **Animation**: Animated drawing playback
- **AI Integration**: Smart shape recognition
- **Cloud Storage**: Automatic cloud backup
- **Version Control**: Drawing history and branching

## 📄 License

This component is part of the VisualVerse project and follows the same licensing terms.

## 🤝 Contributing

When contributing to this component:

1. Follow the existing code style and patterns
2. Add tests for new features
3. Update documentation for API changes
4. Test on both desktop and mobile devices
5. Ensure accessibility compliance

## 📞 Support

For issues or questions about the DrawingCanvas component:

- Check the main VisualVerse documentation
- Review the test files for usage examples
- Open an issue in the project repository
- Contact the development team

---

**Built with ❤️ for the VisualVerse DSA learning community**

