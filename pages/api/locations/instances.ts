import { getInstanceLocations } from 'utils/jig-db-manager'

const { NEXT_PUBLIC_RUN_NETWORK } = process.env

export default async (req, res) => {
    if (req.method === 'GET') {
        const instances1 = await getInstanceLocations('mineFactoryLocation')
        const instances2 = await getInstanceLocations('gameFactoryLocation')

        const response = {
            [instances1[0].name]: instances1[0].location[NEXT_PUBLIC_RUN_NETWORK],
            [instances2[0].name]: instances2[0].location[NEXT_PUBLIC_RUN_NETWORK]
        }
    
        res.status(200).json(response)
    } else {
        res.status(400).json()
    }
}

