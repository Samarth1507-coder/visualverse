import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DrawingCanvas from './DrawingCanvas';

// Mock canvas context
const mockContext = {
  lineCap: '',
  lineJoin: '',
  strokeStyle: '',
  lineWidth: 0,
  fillStyle: '',
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  closePath: jest.fn(),
  fillRect: jest.fn(),
};

const mockCanvas = {
  getContext: jest.fn(() => mockContext),
  width: 800,
  height: 600,
  style: {},
  toDataURL: jest.fn(() => 'data:image/png;base64,mock-data'),
  getBoundingClientRect: jest.fn(() => ({
    left: 0,
    top: 0,
    width: 800,
    height: 600,
  })),
};

// Mock canvas element
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => mockContext),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'getBoundingClientRect', {
  value: jest.fn(() => ({
    left: 0,
    top: 0,
    width: 800,
    height: 600,
  })),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  value: jest.fn(() => 'data:image/png;base64,mock-data'),
});

describe('DrawingCanvas Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders canvas component', () => {
    render(<DrawingCanvas />);
    
    // Check if canvas element is rendered
    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toBeInTheDocument();
  });

  test('renders toolbar with drawing tools', () => {
    render(<DrawingCanvas />);
    
    // Check for pen tool button
    const penButton = screen.getByTitle('Pen Tool');
    expect(penButton).toBeInTheDocument();
    
    // Check for eraser tool button
    const eraserButton = screen.getByTitle('Eraser Tool');
    expect(eraserButton).toBeInTheDocument();
  });

  test('renders color palette', () => {
    render(<DrawingCanvas />);
    
    // Check for color label
    const colorLabel = screen.getByText('Color:');
    expect(colorLabel).toBeInTheDocument();
    
    // Check for custom color input
    const colorInput = screen.getByTitle('Custom Color');
    expect(colorInput).toBeInTheDocument();
  });

  test('renders brush size selector', () => {
    render(<DrawingCanvas />);
    
    // Check for size label
    const sizeLabel = screen.getByText('Size:');
    expect(sizeLabel).toBeInTheDocument();
    
    // Check for size selector
    const sizeSelect = screen.getByDisplayValue('3');
    expect(sizeSelect).toBeInTheDocument();
  });

  test('renders action buttons', () => {
    render(<DrawingCanvas />);
    
    // Check for clear button
    const clearButton = screen.getByText('Clear');
    expect(clearButton).toBeInTheDocument();
    
    // Check for save button
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeInTheDocument();
  });

  test('calls onSave callback when save button is clicked', () => {
    const mockOnSave = jest.fn();
    render(<DrawingCanvas onSave={mockOnSave} />);
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalled();
  });

  test('changes tool when pen button is clicked', () => {
    render(<DrawingCanvas />);
    
    const penButton = screen.getByTitle('Pen Tool');
    fireEvent.click(penButton);
    
    // The pen button should have active styling
    expect(penButton).toHaveClass('bg-blue-100');
  });

  test('changes tool when eraser button is clicked', () => {
    render(<DrawingCanvas />);
    
    const eraserButton = screen.getByTitle('Eraser Tool');
    fireEvent.click(eraserButton);
    
    // The eraser button should have active styling
    expect(eraserButton).toHaveClass('bg-blue-100');
  });

  test('changes brush size when selector is used', () => {
    render(<DrawingCanvas />);
    
    const sizeSelect = screen.getByDisplayValue('3');
    fireEvent.change(sizeSelect, { target: { value: '5' } });
    
    expect(sizeSelect.value).toBe('5');
  });

  test('changes color when color input is used', () => {
    render(<DrawingCanvas />);
    
    const colorInput = screen.getByTitle('Custom Color');
    fireEvent.change(colorInput, { target: { value: '#FF0000' } });
    
    expect(colorInput.value).toBe('#FF0000');
  });

  test('renders mobile instructions on small screens', () => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    render(<DrawingCanvas />);
    
    // Check for mobile instructions
    const mobileInstructions = screen.getByText(/Use your finger to draw/);
    expect(mobileInstructions).toBeInTheDocument();
  });

  test('applies custom className prop', () => {
    const customClass = 'custom-drawing-canvas';
    render(<DrawingCanvas className={customClass} />);
    
    const container = document.querySelector('.drawing-canvas-container');
    expect(container).toHaveClass(customClass);
  });
});

