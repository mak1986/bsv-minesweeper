import { updateGameResult } from 'utils/jig-common'
import { timeOut } from 'utils/minesweeper-db-manager'

export default async (req, res) => {
    if (req.method === 'POST') {

        const grid = await timeOut(req.query.id)

        await updateGameResult(grid)

        res.status(200).json({ grid })
    } else {
        res.status(400).json()
    }
}


