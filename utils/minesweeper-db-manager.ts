import { ObjectId } from 'mongodb'
import { connectToDatabase } from './mongodb'
import { timeOutGrid, clickCell, flagCell, generateGrid } from './minesweeper'

let db

const getDb = async () => {
    if (!db) {
        const connection = await connectToDatabase()
        db = connection.db
    }

    return db
}

export const getMockGrid = () => {
    return generateGrid(false)
}

export const createGrid = async ({ row, col, location }: { row: number, col: number, location: string }) => {
    const db = await getDb()

    const initialClick = { row, col, location }

    const grid = generateGrid(true, initialClick)

    const res = await db.collection('grids').insertOne(grid)

    // const res = await db.collection('newsItems').findOne({ id: newsItem.id })
    return res.ops[0]
}

export const getGrid = async (id: string) => {
    const db = await getDb()
    const grid = await db.collection('grids').findOne({ _id: new ObjectId(id) })
    return grid
}

export const updateGrid = async (grid: any) => {
    const db = await getDb()

    await db.collection('grids').updateOne({ _id: new ObjectId(grid._id) }, { $set: grid })

}

export const click = async (id: string, row: number, col: number) => {

    const grid = await getGrid(id)

    clickCell(grid, row, col)

    await updateGrid(grid)

    return await getGrid(grid._id)
}

export const flag = async (id: string, row: number, col: number) => {
    const grid = await getGrid(id)

    flagCell(grid, row, col)

    await updateGrid(grid)

    return await getGrid(grid._id)
}

export const timeOut = async (id: string) => {
    const grid = await getGrid(id)

    timeOutGrid(grid)

    await updateGrid(grid)

    return await getGrid(grid._id)
}