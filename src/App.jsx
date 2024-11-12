import React, { useState } from 'react';
import './App.css';

function App() {
  const [baseColor, setBaseColor] = useState('#3498db');
  const [palette, setPalette] = useState([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  // Function to generate the complementary color palette
  const generatePalette = (baseColor) => {
    if (!/^#[0-9A-Fa-f]{6}$/i.test(baseColor)) {
      setError('Please enter a valid hex color code (e.g., #3498db).');
      return;
    }

    setError('');
    const colors = getComplementaryColors(baseColor);
    setPalette(colors);
  };

  // Generate complementary colors by adjusting hue
  const getComplementaryColors = (baseColor) => {
    let colors = [baseColor];
    for (let i = 1; i <= 4; i++) {
      let newColor = adjustColor(baseColor, i * 50); // Adjust by hue shift
      colors.push(newColor);
    }
    return colors;
  };

  // Adjust color by shifting hue
  const adjustColor = (color, shift) => {
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl[0] = (hsl[0] + shift) % 360;
    const newRgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  };

  // Helper functions to convert between color formats
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const h = (max + min) / 2;
    const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * h - 1));
    const l = h;
    return [h * 360, s, l];
  };

  const hslToRgb = (h, s, l) => {
    s = s || 0;
    l = l || 0;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r, g, b;

    if (h < 60) {
      r = c; g = x; b = 0;
    } else if (h < 120) {
      r = x; g = c; b = 0;
    } else if (h < 180) {
      r = 0; g = c; b = x;
    } else if (h < 240) {
      r = 0; g = x; b = c;
    } else if (h < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  };

  const rgbToHex = (r, g, b) => {
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
  };

  // Copy to clipboard with feedback
  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color)
      .then(() => {
        setCopied(color);
        setTimeout(() => setCopied(''), 1500);
      })
      .catch((err) => {
        console.error('Error copying color to clipboard:', err);
      });
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Color Palette Generator</h1>

        <div className="input-container">
          <input
            type="text"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            placeholder="Enter Hex Color"
          />
          <button onClick={() => generatePalette(baseColor)}>Generate Palette</button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="palette-container">
          {palette.map((color, index) => (
            <div key={index} className="color-card">
              <div
                className="color-box"
                style={{ backgroundColor: color }}
              >
                <div className="color-info">
                  <span className="hex-code">{color}</span>
                  <button
                    className="copy-button"
                    onClick={() => copyToClipboard(color)}
                  >
                    {copied === color ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
