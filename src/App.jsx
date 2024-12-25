import { useEffect, useState } from 'react'
import Read from './Read'

export default function App () {
  const [enterAction, setEnterAction] = useState({})
  const [route, setRoute] = useState('')
  
  useEffect(() => {
    window.utools.onPluginEnter((action) => {
      setRoute(action.code)
      setEnterAction(action)
    })
    window.utools.onPluginOut((isKill) => {
      setRoute('')
    })
  }, [])
  
  if (route === 'color' || route === 'cc' || route === 'color convert' || route === '颜色转换' || route === '色值转换') {
    return <Read enterAction={enterAction}/>
  }
  return false
}
