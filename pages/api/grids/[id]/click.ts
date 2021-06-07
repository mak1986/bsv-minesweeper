import { updateGameResult } from 'utils/jig-common'
import { click } from 'utils/minesweeper-db-manager'

export default async (req, res) => {
    if (req.method === 'POST') {

        const grid = await click(req.query.id, req.body.row, req.body.col)

        if (grid.result !== null) {
            await updateGameResult(grid)
        }

        res.status(200).json({ grid })
    } else {
        res.status(400).json()
    }
}


