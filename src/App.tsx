/** @jsx jsx */
import React, { useState, useCallback, useRef } from 'react'
import logo from './logo.svg'
import './App.css'
import { useSpring, animated } from 'react-spring'
import { RemoveScroll } from 'react-remove-scroll'

import GestureView from 'react-gesture-view'
import { useGestureResponder, StateType, Callbacks, ResponderEvent } from 'react-gesture-responder'
import { jsx, css, Global } from '@emotion/core'
import HalfModal from './HalfModal'

const pane = css`
  width: 100%;
  flex-shrink: 0;
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-right: 12px;
  height: 540px;
`

const animationConfig = { mass: 0.8, tension: 185, friction: 24 }
const App: React.FC = () => {
  const [index, setIndex] = useState()
  const [isOpen, setOpen] = useState(true)

  return (
    <div className="App">
      <Global
        styles={css`
          html {
            background-color: rgba(0, 0, 0, 0.5);
            height: 100%;
          }
        `}
      />
      {true && (
        <GestureView value={index} onRequestChange={i => setIndex(i)} enableMouse={true}>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <div
              onClick={() => setOpen(true)}
            // className="App-link"
            // href="https://reactjs.org"
            // target="_blank"
            // rel="noopener noreferrer"
            >
              Learn React
            </div>
          </header>
          <div>page2</div>
          <div>page3</div>
          <div>page4</div>
        </GestureView>
      )}
      <HalfModal isOpen={isOpen} onRequestClose={() => setOpen(false)} pages={[
        <div css={pane}>
          <RemoveScroll enabled={true}>
            <div
              css={css`
                  height: 500px;
                  overflow-y: auto;
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
        </div>,
        <div css={pane}>Pane2</div>,
        <div css={pane}>Pane3</div>,
        <div css={pane}>Pane4</div>,
        <div css={pane}>Pane5</div>,
        <div css={pane}>Pane6</div>
      ]} />
      <div
        onClick={() => {
          setOpen(true)
        }}
      >
        <h2>概要</h2>
        <p>
          SPAをリリースする際にVueやReactを単独でリリースしようとすると、表示までの速度や、ソーシャルシェア、SEOにおいて不利になりうる
        </p>
        <button>OPEN</button>
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
    </div>
  )
}

export default App
