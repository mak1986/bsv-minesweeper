import { AuthContext } from "context/Auth"
import { useContext, useEffect, useRef, useState } from "react"

import { useInterval } from 'rooks';

const bsv = require('bsv')

const Wallet = () => {

    const relayxButtonRef = useRef()
    const { isProd, balance, refreshBalance, purse } = useContext(AuthContext)

    const [startRefreshBalance, stopRefreshBalance] = useInterval(() => {
        console.log('refresh', balance)
        refreshBalance();
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
            setAddress(bsv.Address.fromPrivKey(purse).toString())
            setPublicKey(bsv.PubKey.fromPrivKey(purse).toHex())
            setPrivateKey(purse.toWif())
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
            amount: 0.01,
            currency: "USD",
            devMode: !isProd
        })
    }

    return (
        <div>
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

export default Wallet