import { createContext, useEffect, useState } from "react";
import { Buffer } from 'buffer/'
import Run from 'run-sdk'

const bsv = require('bsv')

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {

    const [isProd, setIsProd] = useState<boolean>(false)
    const [email, setEmail] = useState<string>(null)
    const [owner, setOwner] = useState<any>(null)
    const [purse, setPurse] = useState<any>(null)
    const [run, setRun] = useState<any>(null)
    const [balance, setBalance] = useState<number>()

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)


    const authenticate = (email: string, password: string) => {

        let str = email.toLowerCase().trim() + ' ' + password.toLowerCase().trim()

        let ownerPrivateKey = generatePrivateKey(str + ' owner')
        let pursePrivateKey = generatePrivateKey(str + ' purse')


        setOwner(ownerPrivateKey)
        setPurse(pursePrivateKey)

        setEmail(email.toLowerCase().trim())

        const runConfig = {
            owner: ownerPrivateKey.toWif(),
            purse: pursePrivateKey.toWif()
        } as any

        if (!isProd) {
            runConfig.network = 'test'
        }

        setRun(new Run(runConfig))


        console.log(ownerPrivateKey.toWif())

        console.log(pursePrivateKey.toWif())

        console.log(Run)

        setIsAuthenticated(true)
    }

    useEffect(() => {
        if (run) {
            refreshBalance()
        }
    }, [run])

    const generatePrivateKey = (str: string) => {
        // You can see how big N is here...
        // https://en.bitcoin.it/wiki/Secp256k1
        // Or you can use bip32 as reference
        // https://github.com/moneybutton/bsv/blob/master/lib/bip-32.js#L91 then use derive to get a key
        const N = bsv.Point.getN()
        let n = 1
        let sha256: string, bn: any, condition: boolean

        do {
            sha256 = bsv.Hash.sha256(Buffer.from(str + ' ' + n))
            bn = bsv.Bn.fromBuffer(sha256)

            condition = bn.lt(N)
            n++
        }
        while (!condition)

        return isProd? new bsv.PrivKey(bn, true): new bsv.PrivKey.Testnet(bn, true)
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

    return (
        <AuthContext.Provider value={{
            isProd,
            balance,
            refreshBalance,
            email,
            isAuthenticated,
            authenticate,
            deauthenticate,
            owner,
            purse
        }}>
            {children}
        </AuthContext.Provider>
    )

}

export { AuthContext, AuthProvider }