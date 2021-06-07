import { AuthContext } from 'context/Auth'
import mitt from 'next/dist/next-server/lib/mitt'
import { useContext, useEffect, useState } from 'react'
import { useInterval } from 'rooks'
import network from 'utils/network'


const bomb = '💣'
const flag = '🚩'
const crossMark = '☠️'
const checkMark = '✔️'
const stopwatch = '⏱️'

const defaultTimer = 1000 * 60 * 2 // 2 minutes
const satoshis = 100000000

const Game = () => {

    const { run, balance, refreshBalance, createPurchaseGame, gameFactoryJig, isAuthenticated } = useContext(AuthContext)


    const [loading, setLoading] = useState<boolean>()
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

            if (grid.result === 'won') {
                claimReward(grid.location)
            }

            stopTimer()
        }
    }, [grid])


    const claimReward = async (location: string) => {
        const game = await run.load(location)
    
        await game.sync()
        await game.withdraw()
        await game.sync()

        refreshBalance()
    }

    const startGame = async (row: number, col: number) => {
        const price = (gameFactoryJig.priceSatoshis + 600) / satoshis
        console.log(balance, price, balance >= price)
        if (balance >= price) {
            try {
                setLoading(true)
                await generateGrid(row, col)
                setIsMock(false)
                startTimer()
                setLoading(false)
                refreshBalance()
            } catch (err) {
                setLoading(false)
                alert(`Something went wrong: ${err}`)
            }

        } else {
            alert(`Not enough funds to complete purchase. (${price} BSV)`)
        }
    }

    const setupMockGrid = async () => {
        setIsMock(true)
        const { data } = await network.get<{ grid: any }>('/grids/mock')
        console.log(data)
        setGrid(data.grid)
    }

    const generateGrid = async (row: number, col: number) => {

        const grid = await createPurchaseGame(row, col)

        // const { data } = await network.post<{ grid: any }>('/grids', { row, col, location: purchase.location })
        // console.log(data)
        setGrid(grid)
    }

    const leftClick = async (row: number, col: number) => {
        if (isAuthenticated) {
            if (isMock) {
                await startGame(row, col)
            } else {
                stopTimer()
                setLoading(true)
                const url = `/grids/${grid._id}/click`
                const payload = { row, col }
                const { data } = await network.post<{ grid: any }>(url, payload)
                setGrid(data.grid)
                if(data.grid.result === null){
                    startTimer()
                }
                setLoading(false)
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
            {isAuthenticated && gameFactoryJig && <div className="has-text-white mb-2">
                <p className="">{gameFactoryJig.priceSatoshis / satoshis} BSV per game</p>
                <p className="is-size-7">Reward {(0.9 * (gameFactoryJig.priceSatoshis / satoshis)).toFixed(5)} BSV</p></div>}
            <div className="is-flex is-justify-content-center">
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
            </div>
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
            {loading && <p className="mt-2" style={{height: '50px'}}>Loading please wait...</p>}

            {isAuthenticated && gameFactoryJig && <div className="has-text-left mt-5 is-size-7">
                <p>Information:</p>
                <ol style={{ marginLeft: '20px' }}>
                    <li>Each mine in the game is a NFT (non fungible token). </li>
                    <li>A fee of {gameFactoryJig && gameFactoryJig.priceSatoshis / satoshis} BSV will be charged when the game starts.</li>
                    <li>If the player wins, {(0.9 * (gameFactoryJig.priceSatoshis / satoshis)).toFixed(5)} BSV will be rewarded by the mines.</li>
                    <li>If the player loses, {(0.9 * (gameFactoryJig.priceSatoshis / satoshis)).toFixed(5)} BSV will be shared between the mines.</li>
                </ol>
            </div>}
        </div>
    )
}

export default Game