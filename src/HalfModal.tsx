/** @jsx jsx */
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import { RemoveScroll } from 'react-remove-scroll'

import { useGestureResponder, StateType, Callbacks, ResponderEvent } from 'react-gesture-responder'
import { jsx, css, Global } from '@emotion/core'

type Direction = 'horizontal' | 'vertical' | null

const pane = css`
  width: 100%;
  flex-shrink: 0;
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-right: 12px;
`

const getDirection = (initial: [number, number], xy: [number, number]) => {
  const xDiff = Math.abs(initial[0] - xy[0])
  const yDiff = Math.abs(initial[1] - xy[1])

  // just a regular click
  if (xDiff === yDiff) {
    return null
  }

  if (xDiff > yDiff) {
    return 'horizontal'
  }

  return 'vertical'
}

const paneWidth = window.innerWidth - 40 + 12
const animationConfig = { mass: 0.8, tension: 185, friction: 24 }
// const animationConfig = { tension: 190, friction: 20, mass: 0.4 }
const HalfModal: React.FC<any> = (props: { isOpen: boolean; onRequestClose: Function }) => {
  const [index, setIndex] = useState(0)
  const [{ xy }, set] = useSpring(() => {
    return { xy: [0, 0], config: animationConfig }
  })
  const startVelocity = React.useRef<number | null>(null)
  const [isScrollLocking, setScrollLocking] = useState(false)
  const initialDirection = React.useRef<Direction>(null)

  const shouldCloseOnRelease = (state: StateType) => {
    return (state.velocity > 0.2 && state.direction[0] > 0) || state.delta[1] > 100
  }
  const getNextIndex = (state: StateType) => {
    console.log(state, state.velocity > 0.2 && state.direction[0] > 0 ? 1 : 0)
    if (!initialDirection || state.velocity < 0.2 || initialDirection.current === 'vertical') {
      return index
    }
    return index + (state.direction[0] < 0 ? 1 : -1)
  }
  const scrollableRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    animateToPosition({})
  }, [props.isOpen, index])

  interface Options {
    immediate?: boolean
    nextIndex?: number
  }

  const animateToPosition = ({ immediate, nextIndex }: Options) => {
    // const { width, height } = bounds;
    const velocity = startVelocity.current
    startVelocity.current = null

    // const { x, y } = getDefaultPositions(isOpen, position, width, height);
    console.log('velocity', velocity, props.isOpen)
    console.log('index:', nextIndex || index)
    set({
      xy: [-(nextIndex || index) * paneWidth, props.isOpen ? 0 : 540],
      config: {
        ...animationConfig,
        velocity: velocity || 0
      },
      immediate: immediate || false
    })
  }

  const onEnd = (state: StateType) => {
    const close = shouldCloseOnRelease(state)
    console.log('should close')
    const nextIndex = getNextIndex(state)
    console.log('next-index:', nextIndex)
    setIndex(nextIndex)

    if (close && initialDirection && initialDirection.current === 'vertical') {
      console.log('close')
      props.onRequestClose()
    }

    animateToPosition({ nextIndex })
  }

  const { bind } = useGestureResponder({
    onStartShouldSet: (state: StateType) => {
      initialDirection.current = null
      return false
      // if (scrollableRef && scrollableRef.current) {
      //   if (state.direction[1]) {
      //     if (scrollableRef.current.scrollTop < 0) {
      //       scrollableRef.current.scrollTop = 0
      //     }
      //     if (scrollableRef.current.scrollTop < 1 && state.direction[1] > 0) {
      //       // setScrollLocking(true)
      //       return true
      //     }
      //   }
      // }
      // return false
    },
    onMoveShouldSet: (state: StateType) => {
      const { initial, xy } = state
      const gestureDirection: Direction = getDirection(initial, xy)
      // console.log(gestureDirection)
      initialDirection.current = gestureDirection
      if (!gestureDirection) {
        return false
      }

      if (gestureDirection === 'vertical') {
        if (scrollableRef && scrollableRef.current) {
          if (scrollableRef.current.scrollTop < 0) {
            scrollableRef.current.scrollTop = 0
          }
          // console.log(state.initialDirection, state.direction)
          return (
            scrollableRef.current.scrollTop < 1 &&
            state.initialDirection[1] > 0 &&
            state.initialDirection[1] == state.direction[1]
          )
        }
      } else if (gestureDirection === 'horizontal') {
        return true
      }
      return false
    },
    onMove: ({ delta, direction }) => {
      const gestureDirection = initialDirection.current
      if (!gestureDirection) {
        return
      }
      const [x, y] = delta

      const initialX = -index * paneWidth
      set({
        xy: [
          initialX + (gestureDirection === 'horizontal' ? x : 0),
          gestureDirection === 'vertical' ? Math.max(y, 0) : 0
        ],
        config: animationConfig,
        immediate: true
      })
    },
    onTerminate: onEnd,
    onRelease: (state: StateType) => {
      startVelocity.current = state.velocity
      setScrollLocking(false)
      onEnd(state)
    }
  })
  return (
    <div className="App">
      <div
        {...bind}
        // aria-hidden={!props.isOpen}
        css={css`
          position: fixed;
          bottom: 0;
          left: 20px;
          right: 20px;
          pointer-events: ${props.isOpen ? 'auto' : 'none'};
          /* min-height: 300px; */
        `}
      >
        <animated.div
          css={css`
            background-color: white;
            border-top-right-radius: 6px;
            border-top-left-radius: 6px;
            position: relative;

            display: flex;
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
              // console.log(y)
              return `translate3d(${x}px, ${y}px, 0)`
            })
          }}
        >
          <div css={pane}>
            <RemoveScroll enabled={props.isOpen}>
              <div
                ref={scrollableRef}
                css={css`
                  height: 500px;
                  overflow-y: ${isScrollLocking ? 'hidden' : 'auto'};
                  padding: 20px;
                  -webkit-overflow-scrolling: touch;
                  /* -webkit-overflow-scrolling: auto; */
                  overflow-scrolling: touch;
                  p {
                    line-height: 1.6;
                  }
                `}
              >
                <h2>概要</h2>
                <p>
                  SPAをリリースする際にVueやReactを単独でリリースしようとすると、表示までの速度や、ソーシャルシェア、SEOにおいて不利になりうる
                </p>
                <p>
                  Nuxt.js（のユニバーサルモード）を中心にSSRを利用する事例も増えてきたが、サーバー・キャッシュなどを考慮する必要があり面倒
                </p>
                <p>
                  SSG（静的サイトジェネレーター）でビルド時にSSRを行うPrerenderというアプローチを利用するとサーバーやキャッシュの考慮が不要になる
                </p>
                <p>
                  ただし、Prerenderはコンテンツの更新ごとにビルドの必要があり、反映までのタイムラグが存在する。
                </p>
                <p>
                  このデメリットを受け入れられれるのであれば、SSRよりSSGを利用するとメリットを享受できる。
                </p>
                <p>
                  SSG（静的サイトジェネレーター）でビルド時にSSRを行うPrerenderというアプローチを利用するとサーバーやキャッシュの考慮が不要になる
                </p>
                <p>
                  ただし、Prerenderはコンテンツの更新ごとにビルドの必要があり、反映までのタイムラグが存在する。
                </p>
                <p>
                  このデメリットを受け入れられれるのであれば、SSRよりSSGを利用するとメリットを享受できる。
                </p>
              </div>
            </RemoveScroll>
          </div>
          <div css={pane}>Pane2</div>
          <div css={pane}>Pane3</div>
        </animated.div>
      </div>
    </div>
  )
}

export default HalfModal
