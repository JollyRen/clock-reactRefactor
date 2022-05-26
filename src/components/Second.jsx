import React, { useContext, useState, useEffect, useRef } from 'react'
import { NowContext } from '../NowContextProvider.jsx'

export default () => {
  const { now } = useContext(NowContext)
  const [secondsDegrees, setSecondsDegrees] = useState(90)
  const [secondsHand, setSecondsHand] = useState(useRef())

  useEffect(() => {
    setSecondsDegrees((now.getSeconds() / 60) * 360 + 90)
  }, [now])

  useEffect(() => {
    const rotationByRef = () => {
      secondsHand.current.style.transform = `rotate(${secondsDegrees}deg)`
    }
    rotationByRef()
  }, [secondsDegrees])

  return <div className="hand second-hand" ref={(node) => (secondsHand.current = node)} />
}
