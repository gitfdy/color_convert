import { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import './index.css'

const notify = () => toast('Copy success', {
  icon: '🎉', style: {
    borderRadius: '10px', background: '#333', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
})

export default function Read () {
  const [color, setColor] = useState('')
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [hexColor, setHexColor] = useState('')
  const [flutterColor, setFlutterColor] = useState('')
  const [rgbColor, setRgbColor] = useState('')
  const [historyList, setHistoryList] = useState(utools.dbStorage.getItem('history_list') || [])
  const historyListRef = useRef(null)
  
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
        <div className="left-content">
          <div className="input-container">
            <label htmlFor="textInput">输入色值 (例如: red, rgba(255, 0, 0, 0.5) 或 rgb(255, 0, 0) 或 #ff0000)</label>
            <input
              id="textInput"
              size="32"
              type="text"
              value={color}
              autoFocus={true}
              onChange={handleChange}
            />
            <span className="clear-icon" onClick={handleClear}>&times;</span>
            <div className="handleInput">
              <input
                type="text"
                placeholder={'输入前缀，默认为空'}
                value={prefix}
                className="marginRight"
                onChange={handlePrefix}
              />
              <input
                type="text"
                placeholder={'输入后缀，默认为空'}
                value={suffix}
                onChange={handleSuffix}
              />
            </div>
          </div>
          <div onClick={() => handleCopy(rgbColor)} className="color-result">
            转换后的RGB色值: <span>{rgbColor ? (prefix + rgbColor + suffix) : ''}</span>
            <button>复制</button>
          </div>
          <div onClick={() => handleCopy(hexColor)} className="color-result">
            转换后的16进制色值: <span>{hexColor ? (prefix + hexColor + suffix) : ''}</span>
            <button>复制</button>
          </div>
          <div onClick={() => handleCopy(flutterColor)} className="color-result">
            转换后的Flutter色值: <span>{flutterColor ? (prefix + flutterColor + suffix) : ''}</span>
            <button>复制</button>
          </div>
        </div>
      </div>
      <div className="right">
        <h3>转换记录</h3>
        <div className="history-list" ref={historyListRef}>
          <ul>
            {historyList.slice().reverse().map((item, index) => {
              const opacity = 1 - (index / historyList.length * 0.99) // 计算透明度
              return (<li
                key={index}
                onClick={() => setColor(item)}
                style={{ backgroundColor: `rgba(242, 175, 41, ${opacity})` }} // 设置背景色
              >
                {item}
              </li>)
            })}
          </ul>
        </div>
      </div>
    </div>
    <Toaster position="bottom-right"/>
  </div>)
}
