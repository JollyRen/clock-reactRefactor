import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import NowContextProvider from './NowContextProvider'

ReactDOM.render(
  <NowContextProvider>
    <App />
  </NowContextProvider>,
  document.getElementById('root')
)
