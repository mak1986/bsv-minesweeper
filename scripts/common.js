const Run = require('run-sdk')

const dotenv = require('dotenv').config({path: '.env.production.local'})

const outputBalance = async (label, run) => {
    console.log(label, await run.purse.balance())
}

const getRun = () => {

    const network = dotenv.parsed.NEXT_PUBLIC_RUN_NETWORK

    return {
        client: new Run({
            network,
            trust: '*',
            purse: dotenv.parsed.CLIENT_RUN_PURSE,
            owner: dotenv.parsed.CLIENT_RUN_OWNER
        }),
        server: new Run({
            network,
            trust: '*',
            purse: dotenv.parsed.SERVER_RUN_PURSE,
            owner: dotenv.parsed.SERVER_RUN_OWNER
            // logger: console
        })
    }
}

module.exports = {
    outputBalance,
    getRun
}

