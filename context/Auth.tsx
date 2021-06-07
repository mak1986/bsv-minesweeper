import { createContext, useEffect, useState } from "react";
import { Buffer } from 'buffer/'
// import Run from 'run-sdk'
import network from 'utils/network'

// const bsv = require('../node_modules/run-sdk/dist/bsv.browser.min.js')


let Purchase
let Mine

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {

    const [email, setEmail] = useState<string>(null)
    const [owner, setOwner] = useState<any>(null)
    const [purse, setPurse] = useState<any>(null)
    const [run, setRun] = useState<any>(null)
    const [balance, setBalance] = useState<number>()

    // Classes
    // const [_purchase, setPurchaseClass] = useState<any>()
    // const [_mine, setMineClass] = useState<any>()

    // Jigs
    const [mineFactoryJig, setMineFactoryJig] = useState<any>()
    const [gameFactoryJig, setGameFactoryJig] = useState<any>()

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)


    useEffect(() => {
        if (run) {
            run.activate()
            console.log(run)
            setupRun()
            refreshBalance()
        }
    }, [run])


    const authenticate = (email: string, password: string) => {
        const bsv = (window as any).bsv

        let str = email.toLowerCase().trim() + ' ' + password.toLowerCase().trim()

        let ownerPrivateKey = generatePrivateKey(str + ' owner')
        let pursePrivateKey = generatePrivateKey(str + ' purse')

        setOwner(ownerPrivateKey)
        setPurse(pursePrivateKey)

        setEmail(email.toLowerCase().trim())

        const runConfig = {
            owner: ownerPrivateKey.toWIF(),
            purse: pursePrivateKey.toWIF(),
            network: process.env.NEXT_PUBLIC_RUN_NETWORK,
            trust: '*'
        }

        setRun(new (window as any).Run(runConfig))

        // console.log(ownerPrivateKey.toWIF())

        // console.log(pursePrivateKey.toWIF())

        // console.log(Run)

        setIsAuthenticated(true)
    }

    const generatePrivateKey = (str: string) => {
        const bsv = (window as any).bsv
        // You can see how big N is here...
        // https://en.bitcoin.it/wiki/Secp256k1
        // Or you can use bip32 as reference
        // https://github.com/moneybutton/bsv/blob/master/lib/bip-32.js#L91 then use derive to get a key
        const N = bsv.crypto.Point.getN()
        let n = 1
        let sha256: string, bn: any, condition: boolean

        do {
            sha256 = bsv.crypto.Hash.sha256(Buffer.from(str + ' ' + n))
            bn = bsv.crypto.BN.fromBuffer(sha256)

            condition = bn.lt(N)
            n++
        }
        while (!condition)

        return new bsv.PrivateKey(bn, process.env.NEXT_PUBLIC_BSV_NETWORK)//new bsv.PrivKey(bn, true) : new bsv.PrivKey.Testnet(bn, true)
    }

    const setupRun = async () => {
        const { data: classes } = await network.get('/locations/classes')
        const { data: instances } = await network.get('/locations/instances')

        const {
            gameFactoryClassLocation,
            mineFactoryClassLocation,
            mineClassLocation,
            purchaseClassLocation
        } = classes

        const { gameFactoryLocation, mineFactoryLocation } = instances

        // console.log('run', run)

        run.trust(gameFactoryClassLocation.split('_')[0])
        run.trust(mineFactoryClassLocation.split('_')[0])
        run.trust(mineClassLocation.split('_')[0])
        run.trust(purchaseClassLocation.split('_')[0])

        Purchase = await run.load(purchaseClassLocation)
        Mine = await run.load(mineClassLocation)

        const _mineFactoryJig = await run.load(mineFactoryLocation)

        await _mineFactoryJig.sync()

        setMineFactoryJig(_mineFactoryJig)

        const _gameFactoryJig = await run.load(gameFactoryLocation)

        await _gameFactoryJig.sync()


        console.log('_gameFactoryJig', _gameFactoryJig)
        setGameFactoryJig(_gameFactoryJig)
    }

    const deauthenticate = () => {
        setIsAuthenticated(false)
        setOwner(null)
        setPurse(null)
        setEmail(null)
        setRun(null)
    }

    const refreshBalance = async () => {
        setBalance(await run.purse.balance() / 100000000)
    }


    const createPurchaseMine = async () => {
        try {

            // run.activate()
            await mineFactoryJig.sync()
            const buyer = run.owner.pubkey
            const owner = mineFactoryJig.owner
            const price = mineFactoryJig.priceSatoshis

            const purchase = new Purchase(owner, buyer, price)
            await purchase.sync()
            console.log(purchase)

            const { data } = await network.post('/purchase/mine', { location: purchase.location })

            const mine = await run.load(data.mine)

            return mine

        } catch (err) {
            console.log(err)
        }

    }

    const createPurchaseGame = async (row: number, col: number) => {
        try {

            await gameFactoryJig.sync()
            const buyer = run.owner.pubkey
            const owner = gameFactoryJig.owner
            const price = gameFactoryJig.priceSatoshis

            const purchase = new Purchase(owner, buyer, price)
            await purchase.sync()
            console.log(purchase)

            const { data } = await network.post('/purchase/game', { row, col, location: purchase.location })

            // const game = await run.load(data.game)

            // console.log('game', game)
            return data.grid // grid

        } catch (err) {
            console.log(err)
        }

    }

    return (
        <AuthContext.Provider value={{
            balance,
            refreshBalance,
            email,
            isAuthenticated,
            authenticate,
            deauthenticate,
            owner,
            purse,
            run,
            mineFactoryJig,
            gameFactoryJig,
            createPurchaseMine,
            createPurchaseGame
            // _purchase,
            // _mine
        }}>
            {children}
        </AuthContext.Provider>
    )

}

export { AuthContext, AuthProvider }