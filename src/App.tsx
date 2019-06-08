/** @jsx jsx */
import React, { useState, useCallback, useRef } from 'react'
import logo from './logo.svg'
import './App.css'
import { useSpring, animated } from 'react-spring'

import GestureView from 'react-gesture-view'
import { useGestureResponder, StateType, Callbacks, ResponderEvent } from 'react-gesture-responder'
import { jsx, css, Global } from '@emotion/core'

// const animationConfig = { mass: 0.8, tension: 185, friction: 24 }
const animationConfig = { tension: 190, friction: 20, mass: 0.4 }
const App: React.FC = () => {
  const [index, setIndex] = useState()
  const [{ xy, ...other }, set] = useSpring(() => {
    return { xy: [0, 0], config: animationConfig }
  })
  const startVelocity = React.useRef<number | null>(null)

  const shouldCloseOnRelease = (state: StateType) => {
    return false
  }
  const scrollableRef = useRef<HTMLDivElement | null>(null)

  const animateToPosition = (immediate = false) => {
    // const { width, height } = bounds;
    const velocity = startVelocity.current
    startVelocity.current = null

    // const { x, y } = getDefaultPositions(isOpen, position, width, height);
    console.log('velocity', velocity, other)
    set({
      xy: [0, 0],
      config: {
        ...animationConfig,
        velocity: velocity || 0
      },
      immediate
    })
  }

  const onEnd = (state: StateType) => {
    const close = shouldCloseOnRelease(state)
    console.log('should close')

    if (close) {
      console.log('close')
    }

    animateToPosition()
  }

  const { bind } = useGestureResponder({
    onStartShouldSet: () => false,
    onMoveShouldSet: (state: StateType) => {
      console.log(scrollableRef, state)
      if (scrollableRef && scrollableRef.current) {
        if (state.direction[1]) {
          return scrollableRef.current.scrollTop < 40 && state.direction[1] > 0
        }
      }
      return false
    },
    onMove: ({ delta, direction }) => {
      console.log(delta, direction)
      set({ xy: delta, config: animationConfig, immediate: true })
    },
    onTerminate: onEnd,
    onRelease: (state: StateType) => {
      startVelocity.current = state.velocity
      console.log(state)
      onEnd(state)
    }
  })
  return (
    <div className="App">
      <Global
        styles={css`
          html {
            background-color: #333;
            height: 100%;
          }
        `}
      />
      <div
        {...bind}
        css={css`
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          /* min-height: 300px; */
        `}
      >
        <animated.div
          css={css`
            background-color: white;
            &:after {
              content: '';
              position: fixed;
              height: 100vh;
              left: 0;
              right: 0;
              top: 100%;
              background: white;
            }
          `}
          style={{
            // @ts-ignore
            transform: xy.interpolate((x: number, y: number) => {
              console.log(y)
              return `translate3d(0, ${y}px, 0)`
            })
          }}
        >
          <div
            ref={scrollableRef}
            css={css`
              height: 200px;
              overflow-y: auto;
              padding: 40px;
              -webkit-overflow-scrolling: touch;

              overflow-scrolling: touch;
            `}
          >
            <h2>概要</h2>
            <ul>
              <li>
                SPAをリリースする際にVueやReactを単独でリリースしようとすると、表示までの速度や、ソーシャルシェア、SEOにおいて不利になりうる
              </li>
              <li>
                Nuxt.js（のユニバーサルモード）を中心にSSRを利用する事例も増えてきたが、サーバー・キャッシュなどを考慮する必要があり面倒
              </li>
              <li>
                SSG（静的サイトジェネレーター）でビルド時にSSRを行うPrerenderというアプローチを利用するとサーバーやキャッシュの考慮が不要になる
              </li>
              <li>
                ただし、Prerenderはコンテンツの更新ごとにビルドの必要があり、反映までのタイムラグが存在する。
              </li>
              <li>
                このデメリットを受け入れられれるのであれば、SSRよりSSGを利用するとメリットを享受できる。
              </li>
            </ul>
          </div>
        </animated.div>
      </div>
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
