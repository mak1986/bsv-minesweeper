
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
          <title>BSV Minesweeper</title>
          <meta name="description" content="BSV Minesweeper" />
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css" />
          <script src="/bsv.browser.min.js"></script>
          <script src="/run.browser.min.js"></script>
          <script src="https://one.relayx.io/relayone.js"></script>
        </Head>


        <div className="columns">
          <div className="column">

            <h1>Minesweeper</h1>

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
