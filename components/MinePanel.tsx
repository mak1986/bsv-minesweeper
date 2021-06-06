import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AuthContext } from "context/Auth"
import { useContext, useEffect, useState } from "react"
import network from "utils/network"
import Wallet from "./WalletPanel"

const satoshis = 100000000

const MinePanel = () => {

    const { mineFactoryJig, run, balance, refreshBalance, createPurchase, owner } = useContext(AuthContext)

    const [mines, setMines] = useState<any[]>([])
    const [buying, setBuying] = useState<boolean>()

    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (run) {
            fetchMyMines()
        }
    }, [run])

    const fetchMyMines = async () => {
        try{
            setLoading(true)
            const bsv = (window as any).bsv
            const ownerAddress = bsv.Address.fromPrivateKey(owner, process.env.NEXT_PUBLIC_BSV_NETWORK).toString()
    
            const { data } = await network.get('/locations/mines')
    
            const _mines = []
            for (let location of data.locations) {
                console.log('location', location)
                const mine = await run.load(location)
                mine.sync()
                console.log(mine)
                if (ownerAddress === mine.owner) {
                    _mines.push(mine)
                }
            }
            setMines(_mines)
            setLoading(false)
        }catch(err){
            console.log(err)
            alert('Something went wrong: ' + err)
            setLoading(false)

        }
       
    }


    const buy = async () => {
        const price = (mineFactoryJig.priceSatoshis + 600) / satoshis
        // console.log(owner)
        if (balance >= price) {
            try {
                setBuying(true)
                const mine = await createPurchase()
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

    return (
        <div>
            <div className="is-flex is-align-items-center is-justify-content-space-between mb-2">
                <p className="is-size-7">You have {0} mines</p>
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
                            <th className="has-text-white has-text-right">Balance</th>
                        </tr>

                    </thead>
                    <tbody>
                        {mines.map(mine => {
                            return <tr key={mine.id}>
                                <td className=" has-text-left">
                                    <a className="has-text-white" href={`https://run.network/explorer/?query=${mine.location}&network=${process.env.NEXT_PUBLIC_RUN_NETWORK}`} target="_blank">{mine.id}</a>
                                </td>
                                <td className=" has-text-right">
                                    {mine.satoshis/satoshis} BSV
                                </td>
                            </tr>
                        })}
                        {mines.length === 0 && <tr>
                                <td colSpan={2} >
                                    {loading?'Loading...': 'No results'}
                                </td>
                                
                            </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MinePanel