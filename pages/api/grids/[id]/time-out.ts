import { timeOut } from 'utils/minesweeper-db-manager'

export default async (req, res) => {
    if (req.method === 'POST') {
        res.status(200).json({ grid: await timeOut(req.query.id) })
    } else {
        res.status(400).json()
    }
}


