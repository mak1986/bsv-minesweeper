import { flag } from 'utils/db'

export default async (req, res) => {
    if (req.method === 'POST') {
        res.status(200).json({ grid: await flag(req.query.id, req.body.row, req.body.col) })
    } else {
        res.status(400).json()
    }
}


