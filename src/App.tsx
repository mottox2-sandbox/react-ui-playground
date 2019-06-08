import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { useSpring, animated } from 'react-spring'

import GestureView from 'react-gesture-view'
import { useGestureResponder, StateType, Callbacks, ResponderEvent } from 'react-gesture-responder'

const App: React.FC = () => {
  const [index, setIndex] = useState()
  const [{ xy }, set] = useSpring(() => {
    return { xy: [0, 0] }
  })

  const { bind } = useGestureResponder({
    onStartShouldSet: () => true,
    onMove: ({ delta, direction }) => {
      console.log(delta, direction)
      set({ xy: delta, immediate: true })
    }
  })
  return (
    <div className="App">
      <animated.div
        {...bind}
        style={{
          // @ts-ignore
          transform: xy.interpolate((x: number, y: number) => {
            console.log(x, y)
            return `translate3d(${x}px, ${y}px, 0)`
          })
        }}
      >
        contents
      </animated.div>
      {false && (
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
      )}
    </div>
  )
}

export default App
