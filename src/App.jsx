import React from 'react'
import { Min, Hour, Second } from './components'

export default () => {
  return (
    <div className="clock">
      <div className="clock-face">
        <Min />
        <Hour />
        <Second />
      </div>
    </div>
  )
}
