import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AuthContext } from "context/Auth"
import { useContext, useEffect, useState } from "react"
import { useInterval } from "rooks"
import network from "utils/network"

const satoshis = 100000000

const MinePanel = () => {

    const { mineFactoryJig, run, balance, refreshBalance, createPurchaseMine, owner } = useContext(AuthContext)

    const [startRefreshMines, stopRefreshMines] = useInterval(() => {
        fetchMyMines()
        refreshBalance()
        
    }, 1000*60*5); // 5min

    const [mines, setMines] = useState<any[]>([])
    const [buying, setBuying] = useState<boolean>()

    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (run) {
            fetchMyMines()
            startRefreshMines()
        }
    }, [run])


    useEffect(() => {
        return () => {
            stopRefreshMines()
        }
    }, [])


    const fetchMyMines = async () => {
        try {
            setLoading(true)
            const bsv = (window as any).bsv
            const ownerPubkey = bsv.PublicKey.fromPrivateKey(owner, process.env.NEXT_PUBLIC_BSV_NETWORK).toString()

            const { data } = await network.get('/locations/mines')

            const _mines = []
            for (let location of data.locations) {
                console.log('location', location)
                const mine = await run.load(location)
                await mine.sync()
                console.log(mine)
                if (ownerPubkey === mine.owner.pubkeys[1]) {
                    const { id, wins, losses, enabled, satoshis, location } = mine
                    _mines.push({ id, wins, losses, enabled, satoshis, location })
                }
            }
            setMines(_mines)
            setLoading(false)
        } catch (err) {
            console.log(err)
            alert('Something went wrong: ' + err)
            setLoading(false)

        }

    }


    const buy = async () => {
        // TODO change 600 to constant from class
        const price = (mineFactoryJig.priceSatoshis + 600) / satoshis
        // console.log(owner)
        if (balance >= price) {
            try {
                setBuying(true)
                const mine = await createPurchaseMine()
                setMines([...mines, mine])
                setBuying(false)
            } catch (err) {
                alert('Something went wrong: ' + err)
                setBuying(false)
            }

        } else {
            alert(`Not enough funds to complete purchase. (${price} BSV)`)
        }
    }

    const changeEnabledStatus = async (needleMine, enabled: boolean) => {

        replaceMine({ ...needleMine, loading: true })

        const _mine = await run.load(needleMine.location)
        await _mine.sync()

        if (!_mine.enabled && enabled) {
            await _mine.enable()
            await _mine.sync()
            refreshBalance()
        } else if (_mine.enabled && !enabled) {
            await _mine.disable()
            await _mine.sync()
            refreshBalance()
        }

        replaceMine({
            id: _mine.id,
            wins: _mine.wins,
            losses: _mine.losses,
            enabled: _mine.enabled,
            satoshis: _mine.satoshis,
            location: _mine.location,
            loading: false
        })
    }

    const topupMine = async (needleMine: any) => {

        replaceMine({ ...needleMine, loading: true })

        const _mine = await run.load(needleMine.location)
        await _mine.sync()

        await _mine.deposit(0.01 * satoshis)
        await _mine.sync()
        refreshBalance()

        replaceMine({
            id: _mine.id,
            wins: _mine.wins,
            losses: _mine.losses,
            enabled: _mine.enabled,
            satoshis: _mine.satoshis,
            location: _mine.location,
            loading: false
        })
    }

    const withdrawMine = async (needleMine: any) => {

        replaceMine({ ...needleMine, loading: true })

        const _mine = await run.load(needleMine.location)
        await _mine.sync()

        await _mine.withdraw(_mine.satoshis)
        await _mine.sync()
        refreshBalance()

        replaceMine({
            id: _mine.id,
            wins: _mine.wins,
            losses: _mine.losses,
            enabled: _mine.enabled,
            satoshis: _mine.satoshis,
            location: _mine.location,
            loading: false
        })
    }


    const replaceMine = (mine: any) => {
        let _mines = []

        for (let _mine of mines) {
            if (_mine.id === mine.id) {
                _mines.push(mine)
            } else {
                _mines.push(_mine)
            }
        }

        setMines(_mines)
    }

    return (
        <div>
            <div className="is-flex is-align-items-center is-justify-content-space-between mb-2">
                <p className="is-size-7">You have {mines.length} mine{mines.length === 1 ? '' : 's'}.</p>
                <div className="is-flex  is-align-items-center">
                    <p className="is-size-7 mr-2">
                        {mineFactoryJig && <span className="is-block has-text-right mb-1">Price per <span className="has-background-grey-light p-1">💣</span>: {mineFactoryJig.priceSatoshis / satoshis} BSV</span>}
                        <span className="is-block" style={{ fontSize: '9px' }}>*Additional 600 Satoshis tx fee will be charged.</span>
                    </p>
                    <button
                        disabled={buying}
                        onClick={() => buy()}
                        type="button"
                        className={'button is-success is-small' + (buying ? ' is-loading' : '')}>
                        Buy
                    </button>
                </div>
            </div>
            <div>
                <table className="is-size-7 table is-bordered is-fullwidth has-background-dark has-text-white">
                    <thead>
                        <tr>
                            <th className="has-text-left has-text-white">ID</th>
                            <th className="has-text-centered has-text-white">Wins</th>
                            <th className="has-text-centered has-text-white">Losses</th>
                            <th className="has-text-white has-text-centered">Status</th>
                            <th className="has-text-white has-text-right">Balance</th>
                            <th className="has-text-white has-text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mines.map(mine => {
                            return <tr key={mine.id}>
                                <td className="has-text-left is-vcentered">
                                    <a className="has-text-white" href={`https://run.network/explorer/?query=${mine.location}&network=${process.env.NEXT_PUBLIC_RUN_NETWORK}`} target="_blank">{mine.id}</a>
                                </td>
                                <td className="has-text-centered is-vcentered">
                                    {mine.wins}
                                </td>
                                <td className="has-text-centered is-vcentered">
                                    {mine.losses}
                                </td>
                                <td className="has-text-centered is-vcentered">
                                    {mine.enabled
                                        ? <span className="tag is-success">Enabled</span>
                                        : <span className="tag is-danger">Disabled</span>}
                                </td>
                                <td className="has-text-right is-vcentered">
                                    {mine.satoshis / satoshis} BSV
                                </td>
                                <td className="has-text-right is-vcentered">
                                    <button disabled={mine.loading} onClick={() => topupMine(mine)} className="button is-small is-light mr-1">Topup 0.01 BSV</button>
                                    <button disabled={mine.loading} onClick={() => withdrawMine(mine)} className="button is-small is-light mr-1">Withdraw all</button>
                                    {!mine.enabled && <button disabled={mine.loading} onClick={() => changeEnabledStatus(mine, true)} className="button is-success is-small" >
                                        <span className="icon">
                                            <FontAwesomeIcon icon={['fas', 'power-off']} />
                                        </span>
                                    </button>}
                                    {mine.enabled && <button disabled={mine.loading} onClick={() => changeEnabledStatus(mine, false)} className="button is-danger is-small">
                                        <span className="icon">
                                            <FontAwesomeIcon icon={['fas', 'power-off']} />
                                        </span>
                                    </button>}
                                </td>
                            </tr>
                        })}
                        {mines.length === 0 && <tr>
                            <td colSpan={6} >
                                {loading ? 'Loading...' : 'No results'}
                            </td>

                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MinePanel