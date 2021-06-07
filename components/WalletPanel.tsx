import { AuthContext } from "context/Auth"
import { useContext, useEffect, useRef, useState } from "react"

import { useInterval } from 'rooks';

// const bsv = require('../node_modules/run-sdk/dist/bsv.browser.min.js')

const WalletPanel = () => {

    const relayxButtonRef = useRef()
    const { refreshBalance, purse } = useContext(AuthContext)

    const [startRefreshBalance, stopRefreshBalance] = useInterval(() => {
        refreshBalance()
    }, 5000);

    const [publickKeyIsHidden, setPublicKeyIsHidden] = useState<boolean>(true)
    const [privateKeyIsHidden, setPrivateKeyIsHidden] = useState<boolean>(true)

    const [address, setAddress] = useState<string>('')
    const [publiceKey, setPublicKey] = useState<string>('')
    const [privateKey, setPrivateKey] = useState<string>('')

    const [relayone, setRelayone] = useState<any>()


    useEffect(() => {
        setRelayone((window as any).relayone)

        startRefreshBalance()
        return () => {
            stopRefreshBalance()
        }
    }, [])


    useEffect(() => {
        if (purse) {
            const bsv = (window as any).bsv
            setAddress(
                bsv.Address.fromPrivateKey(purse, process.env.NEXT_PUBLIC_BSV_NETWORK).toString()
                //isProd
                //? bsv.Address.fromPrivKey(purse).toString()
                //: bsv.Address.Testnet.fromPrivKey(purse).toString()
            )
            setPublicKey(bsv.PublicKey.fromPrivateKey(purse).toHex()) //bsv.PubKey.fromPrivKey(purse).toHex())
            setPrivateKey(purse.toWIF())
        }
    }, [purse])



    useEffect(() => {

        if (relayone) {
            bootstrapRelayx()
        }

    }, [relayone])



    const bootstrapRelayx = async () => {
        relayone.render(relayxButtonRef.current, {
            to: address,
            editable: true,
            amount: 0.1,
            currency: "USD",
            devMode: process.env.NEXT_PUBLIC_BSV_NETWORK === 'testnet'
        })
    }

    return (
        <div>
            {/* <div className="notification is-warning is-small" style={{fontSize: '12px'}}>
            <strong>Attention!</strong> BSV-Minesweeper app is in BETA phase. Do not transfer funds from mainnet to this wallet. Use <a className="has-text-grey has-text-weight-semibold" style={{textDecoration: 'underline'}} href="https://faucet.bitcoincloud.net" target="_blank">https://faucet.bitcoincloud.net</a> to topup free BSV on Testnet.</div> */}
            <div className="mb-2">
                <div className="is-flex is-align-items-center is-justify-content-space-between mb-2">
                    <div>
                        <p>Address</p>
                        <span className="tag is-dark">{address}</span>
                    </div>
                    <div>
                        <p>Topup</p>
                        <div ref={relayxButtonRef} id="relayx-button"></div>

                    </div>
                </div>
            </div>

            <div className="is-flex is-align-items-center is-justify-content-space-between mb-2">
                <span className="tag is-dark mr-2">{publickKeyIsHidden ? '*'.repeat(publiceKey.length) : publiceKey}</span>
                <button
                    onClick={() => setPublicKeyIsHidden(!publickKeyIsHidden)}
                    className="button is-small is-dark"
                >{publickKeyIsHidden ? 'Show' : 'Hide'} Public key</button>
            </div>

            <div className="is-flex is-align-items-center is-justify-content-space-between">
                <span className="tag is-dark mr-2">{privateKeyIsHidden ? '*'.repeat(privateKey.length) : privateKey}</span>
                <button
                    onClick={() => setPrivateKeyIsHidden(!privateKeyIsHidden)}
                    className="button is-small is-dark"
                >{privateKeyIsHidden ? 'Show' : 'Hide'} Private key</button>
            </div>
        </div>


    )
}

export default WalletPanel