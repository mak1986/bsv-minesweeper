import Login from 'components/Login'
import Tabs from 'components/Tabs'
import { AuthContext } from 'context/Auth'
import Head from 'next/head'
import { useContext, useEffect, useRef, useState } from 'react'
import network from 'utils/network'

const bomb = '💣'
const flag = '🚩'
const crossMark = '☠️'
const checkMark = '✔️'

export default function Home() {

  const { isAuthenticated } = useContext(AuthContext)

  const relayxButtonRef = useRef()
  const [grid, setGrid] = useState<any>()

  const [relayone, setRelayone] = useState<any>()


  useEffect(() => {
    setRelayone((window as any).relayone)
  }, [])

  useEffect(() => {

    if (relayone) {
      // bootstrapRelayx()
    }

  }, [relayone])


  const bootstrapRelayx = async () => {
    // relayone.render(relayxButtonRef.current, {
    //   to: "[1handle, address, paymail, or script]",
    //   amount: 10,
    //   currency: "USD",
    //   devMode: true
    // })

    try {

      // const token = await relayone.authBeta();
      // const [payload, signature] = token.split(".")
      // const data = JSON.parse(atob(payload))

      // console.log('data', data)
      // if (data.origin !== "localhost:3000") throw new Error();

      // const res = await relayone.isLinked()
      // console.log('token', token,'res', res)
      // console.log((window as any).relayone.alpha.run.getOwner())
      const owner = await relayone.alpha.run.getOwner()

      console.log('owner', owner)
    } catch (err) {
      console.error(err)
    }

  }


  const generateGrid = async () => {
    const { data } = await network.post<{ grid: any }>('/grids', {})
    console.log(data)
    setGrid(data.grid)
  }

  const leftClick = async (row: number, col: number) => {
    const url = `/grids/${grid._id}/click`
    const payload = { row, col }
    const { data } = await network.post<{ grid: any }>(url, payload)
    setGrid(data.grid)
  }

  const rightClick = async (e: any, row: number, col: number) => {
    e.preventDefault()
    const url = `/grids/${grid._id}/flag`
    const payload = { row, col }
    const { data } = await network.post<{ grid: any }>(url, payload)
    setGrid(data.grid)
  }


  const renderCell = (result: any, cell: any) => {


    if (cell.value !== null && cell.value > -1) {
      if (cell.value === 0) {
        return " "
      } else {
        return cell.value
      }
    }


    if (result !== null) { // finished
      if (cell.flaged) {
        if (cell.value === bomb) {
          return checkMark
        } else {
          return crossMark
        }
      } else {
        if (cell.value === bomb) {
          return bomb
        }
      }
    } else { // playing

      if (cell.flaged) {
        return flag
      } else {
        return null
      }
    }

  }

  return (
    <section className="section">
      <div className="container">

        <Head>
          <title>BSV Minesweeper</title>
          <meta name="description" content="BSV Minesweeper" />
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css" />
          <script src="https://unpkg.com/bsv@2.0.7"></script>
          <script src="https://unpkg.com/run-sdk"></script>
          <script src="https://one.relayx.io/relayone.js"></script>
        </Head>


        <div className="columns">
          <div className="column">

            <h1>Minesweeper</h1>

          </div>
        </div>
        <div className="columns">
          <div className="column is-flex is-justify-content-center">
            <div id="grid">
              <table>
                <tbody>
                  {grid && grid.rows.map((row, rowKey) => <tr key={rowKey}>
                    {row.map((col, colKey) => <td
                      key={colKey}
                      onContextMenu={(e: any) => rightClick(e, rowKey, colKey)}
                      onClick={() => leftClick(rowKey, colKey)}
                      className={(grid.result !== null && col.flaged && col.value !== bomb ? 'wrong' : '') + ' ' + (grid.result !== null && col.flaged && col.value === bomb ? 'correct' : '') + ' ' + (col.clicked ? 'clicked' : '')}>
                      {renderCell(grid.result, col)}
                    </td>)}
                  </tr>)}
                </tbody>

              </table>

              {grid && <div className="mt-5">
                <p>{flag}</p>
                <p style={{ color: 'white' }}>{grid.flags}/{grid.mines}</p>
              </div>}
              {/* <div ref={relayxButtonRef} id="relayx-button"></div> */}

              <button className="button is-dark" onClick={() => generateGrid()}>Reset Grid</button>

            </div>

          </div>
          <div className="column is-flex is-justify-content-center">
            <div style={{width: '100%'}}>
              <Login />

              {isAuthenticated && <Tabs />}

            </div>




          </div>

        </div>


      </div>

    </section>

  )
}
