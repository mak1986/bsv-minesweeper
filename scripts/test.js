const dotenv = require('dotenv').config({path: '.env.production.local'})

const Run = require('run-sdk')

const { outputBalance } = require('./common')
const { deploy } = require('./deploy')

const getRun = () => {

    const mockchain = new Run.plugins.Mockchain()

    return {
        client: new Run({
            blockchain: mockchain,
            trust: '*',
            purse: dotenv.parsed.CLIENT_RUN_PURSE,
            owner: dotenv.parsed.CLIENT_RUN_OWNER
        }),
        server: new Run({
            blockchain: mockchain,
            trust: '*',
            purse: dotenv.parsed.SERVER_RUN_PURSE,
            owner: dotenv.parsed.SERVER_RUN_OWNER
            // logger: console
        })
    }
}



const test = async () => {

    console.log('------------')
    console.log('')
    console.log('testBuyMines')

    const { client, server, locations } = await deploy(getRun())

    server.activate()
    
    const mineFactory = await server.load(locations.mineFactoryInstance)
    const gameFactory = await server.load(locations.gameFactoryInstance)
    await mineFactory.sync()

    client.activate()
    const Purchase = await client.load(locations.purchaseClass)

    const mines = []

    for (let i of (new Array(10))) {
        const purchase = new Purchase(
            server.owner.pubkey,
            client.owner.pubkey,
            mineFactory.priceSatoshis
        )
        await purchase.sync()

        console.log('purchase before', purchase)

        server.activate()
        outputBalance('server.balance', server)
        const mine = await mineFactory.produce(purchase)
        mines.push(mine)
        await mineFactory.sync()
        client.activate()
        await purchase.sync()
        console.log('purchase after', purchase)
    }

    client.activate()
    console.log('mineFactory', mineFactory)

    for (let mine of mines) {
        await mine.enable()
        await mine.sync()
        await mine.deposit(gameFactory.priceSatoshis / mines.length)
        await mine.sync()
    }

    console.log('mines', mines)

    const purchase = new Purchase(
        server.owner.pubkey,
        client.owner.pubkey,
        gameFactory.priceSatoshis
    )

    server.activate()

    const game = gameFactory.produce(purchase, mines)

    game.sync()

    console.log('game', game)

    client.activate()

    for (let mine of mines) {
        await mine.sync()
    }

    console.log('mines', mines)

    await purchase.sync()

    console.log('purchase', purchase)


    server.activate()

    // Mines win

    // await game.lose(mines)

    // Mines lose

    await game.win(mines)

    await game.sync()

    console.log('game', game)

    client.activate()

    for (let mine of mines) {
        await mine.sync()
    }

    console.log('mines', mines)

    console.log('')
    console.log('Test done')
    console.log('')
    console.log('------------')
}



test()