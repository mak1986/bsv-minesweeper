import _ from 'lodash'
import { createGrid } from 'utils/minesweeper-db-manager'
import { getRun, getInstanceLocations, addGame, addPurchase } from 'utils/jig-db-manager'

const { NEXT_PUBLIC_RUN_NETWORK } = process.env

const numberOfMines = 10

export default async (req, res) => {
    if (req.method === 'POST') {
        const run = await getRun()

        const instances = await getInstanceLocations('gameFactoryLocation')

        const gameFactory = await run.load(instances[0].location[NEXT_PUBLIC_RUN_NETWORK])

        await gameFactory.sync()

        const purchase = await run.load(req.body.location)

        await purchase.sync()

        await addPurchase(purchase)

        const mineLocationInstances = await getInstanceLocations('mineLocation')

        const mineLocations = mineLocationInstances
            .filter(instance => instance.location[NEXT_PUBLIC_RUN_NETWORK])
            .map(instance => instance.location[NEXT_PUBLIC_RUN_NETWORK])

        const candidateMines = []

        for (let mineLocation of mineLocations) {
            const mine = await run.load(mineLocation)
            await mine.sync()
            const mineOwner = mine.owner.pubkeys[1]
            if (
                mine.enabled &&
                purchase.buyer !== mineOwner &&
                mine.satoshis > Math.floor(gameFactory.priceSatoshis / numberOfMines)
            ) {
                candidateMines.push(mine)
            }
        }

        const mines = _.shuffle(candidateMines).slice(0, numberOfMines)

        // console.log('mines', JSON.stringify(mines, null, 4))
        // console.log('purchase', JSON.stringify(purchase, null, 4))

        const game = gameFactory.produce(purchase, mines)

        await game.sync()

        await addGame(game)

        const { row, col } = req.body

        res.status(200).json({ grid: await createGrid({ row, col, location: game.location }) })
    } else {
        res.status(400).json()
    }
}


