import React, { useState, useEffect, createContext } from 'react'

export const NowContext = createContext()

export default ({ children }) => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(intervalId)
  }, [now])

  return <NowContext.Provider value={{ now, setNow }}>{children}</NowContext.Provider>
}
