import React, { useState, useEffect, useContext } from 'react'
import { Min, Hour, Second } from './components'
import { NowContext } from './NowContextProvider.jsx'

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
