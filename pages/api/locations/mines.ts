import { getInstanceLocations } from 'utils/jig-db-manager'

const { NEXT_PUBLIC_RUN_NETWORK } = process.env

export default async (req, res) => {
    if (req.method === 'GET') {

        const instances = await getInstanceLocations('mineLocation')

        res.status(200).json({
            locations: instances
                .filter(instance => instance.location[NEXT_PUBLIC_RUN_NETWORK])
                .map(instance => instance.location[NEXT_PUBLIC_RUN_NETWORK])
        })
    } else {
        res.status(400).json()
    }
}


