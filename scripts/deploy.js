const dotenv = require('dotenv').config({ path: '.env.local' })

const Run = require('run-sdk')

const { outputBalance, getRun } = require('./common')

const { GameFactory: GameFactoryClass } = require('../jigs/game-factory')
const { MineFactory: MineFactoryClass } = require('../jigs/mine-factory')
const { Game: GameClass } = require('../jigs/game')
const { Mine: MineClass } = require('../jigs/mine')
const { Purchase: PurchaseClass } = require('../jigs/purchase')


const deploy = async (run) => {
    console.log('------------')
    console.log('')
    console.log('Deploying classes...')
    console.log('')
    const { client, server } = run

    server.activate()

    console.log('clientOwnerPubkey', client.owner.pubkey)
    await outputBalance('clientBalance', client)
    console.log('serverOwnerPubkey', server.owner.pubkey)
    await outputBalance('serverBalance', server)

    server.activate()
    const GameFactory = await server.deploy(GameFactoryClass)
    const MineFactory = await server.deploy(MineFactoryClass)
    const Game = await server.deploy(GameClass)
    const Mine = await server.deploy(MineClass)
    const Purchase = await server.deploy(PurchaseClass)

    await GameFactory.sync()
    await MineFactory.sync()
    await Game.sync()
    await Mine.sync()
    await Purchase.sync()

    console.log('')
    console.log('GameFactory.location', GameFactory.location)
    console.log('MineFactory.location', MineFactory.location)
    console.log('Game.location', Game.location)
    console.log('Mine.location', Mine.location)
    console.log('Purchase.location', Purchase.location)
    console.log('')
    console.log('Deployed classes')
    console.log('')
    console.log('------------')
    console.log('')
    console.log('Deploying Jigs')
    console.log('')

    const gameFactory = new GameFactory(server.owner.pubkey, 500000)
    await gameFactory.sync()

    const mineFactory = new MineFactory(server.owner.pubkey, 500000)
    await mineFactory.sync()

    console.log('gameFactory', gameFactory)
    console.log('mineFactory', mineFactory)

    console.log('')
    console.log('Deployed Jigs')
    console.log('')
    console.log('------------')

    console.log('')
    console.log('Locations')
    console.log('')

    const locations = {
        mineFactoryClass: MineFactory.location,
        mineClass: Mine.location,
        purchaseClass: Purchase.location,
        gameFactoryClass: GameFactory.location,
        gameClass: Game.location,
        gameFactoryInstance: gameFactory.location,
        mineFactoryInstance: mineFactory.location,
    }

    console.log(locations)

    console.log('')
    console.log('------------')

    return { client, server, locations }
}



// deploy(getRun())

module.exports = {
    getRun,
    deploy,
    outputBalance
}