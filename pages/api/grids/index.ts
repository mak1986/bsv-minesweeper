import { createGrid } from 'utils/db'

export default async (req, res) => {
  if (req.method === 'POST') {

    res.status(200).json({ grid: await createGrid() })
  } else {
    res.status(400).json()
  }
}


