import React, { useContext, useState, useEffect, useRef } from 'react'
import { NowContext } from '../NowContextProvider.jsx'

export default () => {
  const { now } = useContext(NowContext)
  const [hourDegrees, setHourDegrees] = useState(90)
  const [hourHand, setHourHand] = useState(useRef())

  useEffect(() => {
    setHourDegrees((now.getMinutes() / 12) * 360 + 90)
  }, [now])

  useEffect(() => {
    const rotationByRef = () => {
      hourHand.current.style.transform = `rotate(${hourDegrees}deg)`
    }
    rotationByRef()
  }, [hourDegrees])

  return <div className="hand hour-hand" ref={(node) => (hourHand.current = node)} />
}
