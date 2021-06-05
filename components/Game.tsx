import { AuthContext } from 'context/Auth'
import { useContext, useEffect, useState } from 'react'
import { useInterval } from 'rooks'
import network from 'utils/network'


const bomb = '💣'
const flag = '🚩'
const crossMark = '☠️'
const checkMark = '✔️'
const stopwatch = '⏱️'

const defaultTimer = 1000 * 60 * 2 // 2 minutes

const Game = () => {

    const { isAuthenticated } = useContext(AuthContext)
    const [grid, setGrid] = useState<any>()

    const [isMock, setIsMock] = useState<boolean>(true)

    const [timer, setTimer] = useState<number>(defaultTimer)

    const [startTimer, stopTimer] = useInterval(() => {
        setTimer(timer - 1000)
    }, 1000);


    useEffect(() => {
        if (timer === 0) {
            timeOut()
        }
    }, [timer])

    useEffect(() => {
        if (!isAuthenticated) {
            setupMockGrid()
        }
    }, [isAuthenticated])


    useEffect(() => {
        if (grid && grid.result) {
            stopTimer()
        }
    }, [grid])

    const startGame = async (row: number, col: number) => {
        await generateGrid(row, col)
        setIsMock(false)
        startTimer()
    }

    const setupMockGrid = async () => {
        setIsMock(true)
        const { data } = await network.get<{ grid: any }>('/grids/mock')
        console.log(data)
        setGrid(data.grid)
    }

    const generateGrid = async (row: number, col: number) => {
        const { data } = await network.post<{ grid: any }>('/grids', { row, col })
        console.log(data)
        setGrid(data.grid)
    }

    const leftClick = async (row: number, col: number) => {
        if (isAuthenticated) {
            if (isMock) {
                await startGame(row, col)
            } else {
                const url = `/grids/${grid._id}/click`
                const payload = { row, col }
                const { data } = await network.post<{ grid: any }>(url, payload)
                setGrid(data.grid)
            }
        }
    }

    const rightClick = async (e: any, row: number, col: number) => {

        e.preventDefault()
        if (isAuthenticated) {
            if (!isMock) {
                const url = `/grids/${grid._id}/flag`
                const payload = { row, col }
                const { data } = await network.post<{ grid: any }>(url, payload)
                setGrid(data.grid)
            }
        }
    }

    const timeOut = async () => {
        stopTimer()
        const url = `/grids/${grid._id}/time-out`
        const { data } = await network.post<{ grid: any }>(url, {})
        setGrid(data.grid)
    }


    const reset = async () => {
        await setupMockGrid()
        setTimer(defaultTimer)
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
        <div id="grid">
            <table>
                <tbody>
                    {grid && grid.rows.map((row, rowKey) => <tr key={rowKey}>
                        {row.map((col, colKey) => <td
                            style={{ cursor: isAuthenticated ? 'pointer' : 'not-allowed' }}
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
                <div className="is-flex is-justify-content-space-around">
                    <div>
                        <p>{stopwatch}</p>
                        <p style={{ color: 'white' }}>{timer / 1000} Seconds</p>

                    </div>
                    <div>
                        <p>{flag}</p>
                        <p style={{ color: 'white' }}>{grid.flags}/{grid.mines}</p>
                    </div>
                </div>

                {grid && grid.result && <div>
                    <p className={grid.result === 'won' ? 'has-text-success' : 'has-text-danger'}>You {grid.result}</p>
                </div>}
            </div>}

            {isAuthenticated && grid && grid.result && <button className="button is-dark" onClick={async () => await reset()}>Reset Grid</button>}

        </div>
    )
}

export default Game