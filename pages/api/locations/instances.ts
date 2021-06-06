import { getInstanceLocations } from 'utils/jig-db-manager'

const { NEXT_PUBLIC_RUN_NETWORK } = process.env

export default async (req, res) => {
    if (req.method === 'GET') {
        const instances = await getInstanceLocations('mineFactoryLocation')

        const response = {
            [instances[0].name]: instances[0].location[NEXT_PUBLIC_RUN_NETWORK]
        }
    
        res.status(200).json(response)
    } else {
        res.status(400).json()
    }
}

