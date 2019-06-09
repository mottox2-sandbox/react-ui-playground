/** @jsx jsx */
import React, { useState, useCallback, useRef } from 'react'
import { useSpring, animated } from 'react-spring'
import { RemoveScroll } from 'react-remove-scroll'

import { useGestureResponder, StateType, Callbacks, ResponderEvent } from 'react-gesture-responder'
import { jsx, css, Global } from '@emotion/core'

const animationConfig = { mass: 0.8, tension: 185, friction: 24 }
// const animationConfig = { tension: 190, friction: 20, mass: 0.4 }
const HalfModal: React.FC<any> = (props: { isOpen: boolean; onRequestClose: Function }) => {
  const [index, setIndex] = useState()
  const [{ xy, ...other }, set] = useSpring(() => {
    return { xy: [0, 0], config: animationConfig }
  })
  const startVelocity = React.useRef<number | null>(null)
  const [isScrollLocking, setScrollLocking] = useState(false)

  const shouldCloseOnRelease = (state: StateType) => {
    console.log(state.delta[1])
    return (state.velocity > 0.2 && state.direction[0] > 0) || state.delta[1] > 100
  }
  const scrollableRef = useRef<HTMLDivElement | null>(null)

  const animateToPosition = (immediate = false) => {
    // const { width, height } = bounds;
    const velocity = startVelocity.current
    startVelocity.current = null

    // const { x, y } = getDefaultPositions(isOpen, position, width, height);
    console.log('velocity', velocity, other)
    set({
      xy: [0, props.isOpen ? 0 : 540],
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
      props.onRequestClose()
    }

    animateToPosition()
  }

  const { bind } = useGestureResponder({
    onStartShouldSet: (state: StateType) => {
      if (scrollableRef && scrollableRef.current) {
        if (state.direction[1]) {
          if (scrollableRef.current.scrollTop < 0) {
            scrollableRef.current.scrollTop = 0
          }
          if (scrollableRef.current.scrollTop < 1 && state.direction[1] > 0) {
            // setScrollLocking(true)
            return true
          }
        }
      }
      return false
    },
    onMoveShouldSet: (state: StateType) => {
      // console.log(scrollableRef, state)
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
      return false
    },
    onMove: ({ delta, direction }) => {
      const [x, y] = delta
      set({ xy: [x, Math.max(y, 0)], config: animationConfig, immediate: true })
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
      <RemoveScroll>
        <div
          {...bind}
          css={css`
            position: fixed;
            bottom: 0;
            left: 20px;
            right: 20px;
            /* min-height: 300px; */
          `}
        >
          <animated.div
            css={css`
              background-color: white;
              border-top-right-radius: 6px;
              border-top-left-radius: 6px;
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
                return `translate3d(0, ${y}px, 0)`
              })
            }}
          >
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
          </animated.div>
        </div>
      </RemoveScroll>
    </div>
  )
}

export default HalfModal
