import { createGrid } from 'utils/minesweeper-db-manager'

export default async (req, res) => {
  if (req.method === 'POST') {
    res.status(200).json({ grid: await createGrid(req.body) })
  } else {
    res.status(400).json()
  }
}


