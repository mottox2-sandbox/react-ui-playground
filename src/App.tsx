import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'

import GestureView from 'react-gesture-view'

const App: React.FC = () => {
  const [index, setIndex] = useState(0)
  return (
    <div className="App">
      <GestureView value={index} onRequestChange={i => setIndex(i)} enableMouse={true}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <div>page2</div>
        <div>page3</div>
        <div>page4</div>
      </GestureView>
    </div>
  )
}

export default App
