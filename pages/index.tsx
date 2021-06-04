import Head from 'next/head'
import { useState } from 'react'
import network from 'utils/network'

const bomb = '💣'
const flag = '🚩'
const crossMark = '☠️'
const checkMark = '✔️'

export default function Home() {

  const [grid, setGrid] = useState<any>()

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
    <div>
      <Head>
        <title>BSV Minesweeper</title>
        <meta name="description" content="BSV Minesweeper" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Minesweeper</h1>
      <div>

        <table id="grid">
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

        {grid && <div>
          <p>{flag}</p>
          <p style={{ color: 'white' }}>{grid.flags}/{grid.mines}</p>
        </div>}
      </div>

      <button onClick={() => generateGrid()}>Reset Grid</button>
    </div>
  )
}
