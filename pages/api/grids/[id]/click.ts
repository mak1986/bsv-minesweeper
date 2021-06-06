import { click } from 'utils/minesweeper-db-manager'

export default async (req, res) => {
    if (req.method === 'POST') {
        res.status(200).json({ grid: await click(req.query.id, req.body.row, req.body.col) })
    } else {
        res.status(400).json()
    }
}


