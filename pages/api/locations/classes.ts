import { getClassLocations } from 'utils/jig-db-manager'

const { NEXT_PUBLIC_RUN_NETWORK } = process.env

export default async (req, res) => {
    if (req.method === 'GET') {

        const classes = await getClassLocations()

        const response = {}

        for (let c of classes) {
            response[c.name] = c.location[NEXT_PUBLIC_RUN_NETWORK]
        }

        res.status(200).json(response)
    } else {
        res.status(400).json()
    }
}

