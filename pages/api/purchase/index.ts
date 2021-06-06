import { getRun, getInstanceLocations, addMine, addPurchase } from 'utils/jig-db-manager'

const { NEXT_PUBLIC_RUN_NETWORK } = process.env

export default async (req, res) => {
    if (req.method === 'POST') {
        const run = await getRun()

        const instances = await getInstanceLocations('mineFactoryLocation')

        const mineFactory = await run.load(instances[0].location[NEXT_PUBLIC_RUN_NETWORK])

        await mineFactory.sync()

        const purchase = await run.load(req.body.location)

        await purchase.sync()

        await addPurchase(purchase)

        const mine = mineFactory.produce(purchase)

        await mine.sync()
        
        await addMine(mine)

        res.status(200).json({ mine: mine.location })
    } else {
        res.status(400).json()
    }
}


