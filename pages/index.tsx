
import Game from 'components/Game'
import Login from 'components/Login'
import Tabs from 'components/Tabs'
import Head from 'next/head'

import { AuthContext } from 'context/Auth'
import { useContext } from 'react'


export default function Home() {

  const { isAuthenticated } = useContext(AuthContext)

  return (
    <section className="section">
      <div className="container">

        <Head>
          <title>Satoblast</title>
          <meta name="description" content="Satoblast" />
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css" />
          <script src="/bsv.browser.min.js"></script>
          <script src="/run.browser.min.js"></script>
          <script src="https://one.relayx.io/relayone.js"></script>
        </Head>


        <div className="columns">
          <div className="column">

            <div className="is-flex is-align-items-center is-justify-content-center">
              <img width="65" height="" src="/Bomb_B_logo.jpg" />
              <h1>Satoblast</h1>

            </div>
            {/* <p className="is-size-7"><span className="has-text-grey">Topup from: </span><a className="has-text-grey has-text-weight-semibold" style={{textDecoration: 'underline'}} href="https://faucet.bitcoincloud.net" target="_blank">https://faucet.bitcoincloud.net</a> </p> */}
          </div>
        </div>
        <div className="columns">
          <div className="column is-flex is-justify-content-center">
            <Game />

          </div>
          <div className="column is-flex is-justify-content-center">
            <div style={{ width: '100%' }}>
              <Login />

              {isAuthenticated && <Tabs />}

            </div>

          </div>

        </div>

      </div>

    </section>

  )
}
