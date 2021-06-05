import { getMockGrid } from 'utils/db'

export default async (req, res) => {
    if (req.method === 'GET') {

        res.status(200).json({ grid: getMockGrid() })
    } else {
        res.status(400).json()
    }
}

