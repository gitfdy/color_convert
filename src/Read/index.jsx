import { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import './index.css'
import {
  SliderPicker
} from 'react-color'

const notify = () => toast('Copy success', {
  icon: '🎉', style: {
    borderRadius: '10px', background: '#333', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
})

export default function Read () {
  const [color, setColor] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [hexColor, setHexColor] = useState('')
  const [flutterColor, setFlutterColor] = useState('')
  const [rgbColor, setRgbColor] = useState('')
  const [historyList, setHistoryList] = useState(utools.dbStorage.getItem('history_list') || [])
  const historyListRef = useRef(null)
  const colorPickerRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  useEffect(() => {
    if (color) {
      const rgb = convertColorToRgb(color)
      if (rgb) {
        setRgbColor(rgb)
        setHexColor(rgbaToHex(rgb))
        setFlutterColor(rgbaToFlutterColor(rgb))
      }
    } else {
      clearColors()
    }
    
    if (showColorPicker) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = setTimeout(() => {
        colorPickerRef.current.classList.add('fade-out')
        setTimeout(() => setShowColorPicker(false), 500)
      }, 3000)
    }
  }, [color])
  
  const handleChange = (e) => {
    setColor(formatInput(e.target.value))
  }
  
  const handlePrefix = (e) => {
    setPrefix(e.target.value)
  }
  
  const handleSuffix = (e) => {
    setSuffix(e.target.value)
  }
  
  const handleClear = () => {
    clearColors()
    setColor('')
  }
  
  const handleCopy = (text) => {
    const _copyText = prefix + text + suffix
    navigator.clipboard.writeText(_copyText).then(() => {
      notify()
      setTimeout(saveConvertHistory, 500)
    })
  }
  
  const saveConvertHistory = () => {
    if (_isValidateColor(color)) {
      let list = utools.dbStorage.getItem('history_list') || []
      if (!list.includes(color)) {
        if (list.length >= 20) {
          list.shift()
        }
        list.push(color)
        utools.dbStorage.setItem('history_list', list)
        setHistoryList(list)
        historyListRef.current.scrollTo({
          top: 0, behavior: 'smooth' // 平滑滚动
        })
      }
    }
  }
  
  const _isValidateColor = (color) => {
    const s = new Option().style
    s.color = color
    return s.color !== ''
  }
  
  const convertColorToRgb = (color) => {
    const ctx = document.createElement('canvas').getContext('2d')
    ctx.fillStyle = color
    const rgb = ctx.fillStyle.match(/^#[0-9a-f]{6}$/i) ? ctx.fillStyle : null
    if (rgb) {
      const r = parseInt(rgb.slice(1, 3), 16)
      const g = parseInt(rgb.slice(3, 5), 16)
      const b = parseInt(rgb.slice(5, 7), 16)
      return `rgb(${r}, ${g}, ${b})`
    }
    return null
  }
  
  const isHexColor = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color)
  
  const hexToRgba = (hex) => {
    let r = 0, g = 0, b = 0, a = 1
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16)
      g = parseInt(hex[2] + hex[2], 16)
      b = parseInt(hex[3] + hex[3], 16)
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16)
      g = parseInt(hex[3] + hex[4], 16)
      b = parseInt(hex[5] + hex[6], 16)
    }
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }
  
  const rgbaToHex = (rgba) => {
    const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?|\.\d+))?\)$/.exec(rgba)
    if (!result) return ''
    const r = parseInt(result[1])
    const g = parseInt(result[2])
    const b = parseInt(result[3])
    const a = result[4] !== undefined ? Math.round(parseFloat(result[4]) * 255) : 255
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}${a.toString(16).padStart(2, '0').toUpperCase()}`
  }
  
  const rgbaToFlutterColor = (rgba) => {
    const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?|\.\d+))?\)$/.exec(rgba)
    if (!result) return ''
    const r = parseInt(result[1])
    const g = parseInt(result[2])
    const b = parseInt(result[3])
    const a = result[4] !== undefined ? Math.round(parseFloat(result[4]) * 255) : 255
    return `Color(0x${a.toString(16).padStart(2, '0').toUpperCase()}${r.toString(16).padStart(2, '0').toUpperCase()}${g.toString(16).padStart(2, '0').toUpperCase()}${b.toString(16).padStart(2, '0').toUpperCase()})`
  }
  
  const formatInput = (value) => {
    return value.replace(/，/g, ',')
      .replace(/。/g, '.')
      .replace(/！/g, '!')
      .replace(/？/g, '?')
      .replace(/：/g, ':')
      .replace(/；/g, ';')
      .replace(/（/g, '(')
      .replace(/）/g, ')')
      .replace(/【/g, '[')
      .replace(/】/g, ']')
      .replace(/「/g, '{')
      .replace(/」/g, '}')
      .replace(/‘/g, '\'')
      .replace(/’/g, '\'')
      .replace(/“/g, '"')
      .replace(/”/g, '"')
  }
  
  const clearColors = () => {
    setHexColor('')
    setFlutterColor('')
    setRgbColor('')
  }
  
  return (<div className="container">
    <div className="content">
      <div className="left">
        <h3>输入颜色</h3>
        <div className="current-color" style={{
          backgroundColor: rgbColor || 'transparent',
          boxShadow: '0 0 10px 5px rgba(0, 123, 255, 0.5)',
          animation: 'glow 2s infinite'
        }} onClick={() => setShowColorPicker(!showColorPicker)}/>
        {showColorPicker && (<SliderPicker
            className="sketch-picker-position"
            color={color}
            onChangeComplete={(newColor) => setColor(newColor.hex)}
          />)}
        <div className="left-content">
          <div className="input-section">
            <div className="input-container">
              <label htmlFor="textInput">输入色值</label>
              <div className="main-input-wrapper">
                <input
                  id="textInput"
                  size="32"
                  type="text"
                  value={color}
                  autoFocus={true}
                  onChange={handleChange}
                  placeholder="支持: red, rgb(255,10,20), #ff0000"
                />
                <span className="clear-icon" onClick={handleClear}>&times;</span>
              </div>
            </div>
            <div className="prefix-suffix-container">
              <div className="input-container">
                <label>前缀</label>
                <input
                  type="text"
                  placeholder="输入前缀"
                  value={prefix}
                  onChange={handlePrefix}
                />
              </div>
              <div className="input-container">
                <label>后缀</label>
                <input
                  type="text"
                  placeholder="输入后缀"
                  value={suffix}
                  onChange={handleSuffix}
                />
              </div>
            </div>
          </div>
          
          <div className="results-section">
            <div onClick={() => handleCopy(rgbColor)} className="color-result">
              <div className="result-content">
                <div className="text-container">
                  <label>RGB色值</label>
                  <span>{rgbColor ? (prefix + rgbColor + suffix) : '-'}</span>
                </div>
              </div>
              <button>复制</button>
            </div>
            
            <div onClick={() => handleCopy(hexColor)} className="color-result">
              <div className="result-content">
                <div className="text-container">
                  <label>16进制色值</label>
                  <span>{hexColor ? (prefix + hexColor + suffix) : '-'}</span>
                </div>
              </div>
              <button>复制</button>
            </div>
            
            <div onClick={() => handleCopy(flutterColor)} className="color-result">
              <div className="result-content">
                <div className="text-container">
                  <label>Flutter色值</label>
                  <span>{flutterColor ? (prefix + flutterColor + suffix) : '-'}</span>
                </div>
              </div>
              <button>复制</button>
            </div>
          </div>
        </div>
      </div>
      <div className="right">
        <h3>转换记录</h3>
        <div className="history-list" ref={historyListRef}>
          <ul>
            {historyList.slice().reverse().map((item, index) => (<li
              key={index}
              onClick={() => setColor(item)}
            >
              <div
                className="color-preview"
                style={{ backgroundColor: item }}  // 直接使用颜色值
              />
              <div className="text-container">
                <span>{item}</span>
              </div>
            </li>))}
          </ul>
        </div>
      </div>
    </div>
    <Toaster position="bottom-right"/>
  </div>)
}
