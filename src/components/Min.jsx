import React, { useContext, useState, useEffect, useRef } from 'react'
import { NowContext } from '../NowContextProvider.jsx'

export default () => {
  const { now } = useContext(NowContext)
  const [minDegrees, setMinDegrees] = useState(90)
  const [minHand, setMinHand] = useState(useRef())

  useEffect(() => {
    setMinDegrees((now.getMinutes() / 60) * 360 + 90)
  }, [now])

  useEffect(() => {
    const rotationByRef = () => {
      minHand.current.style.transform = `rotate(${minDegrees}deg)`
    }
    rotationByRef()
  }, [minDegrees])

  return <div className="hand min-hand" ref={(node) => (minHand.current = node)} />
}
