import { getRun } from 'utils/jig-db-manager'

export const updateGameResult = async (grid) => {
    const run = getRun()
    const game = await run.load(grid.location)
    await game.sync()

    const mines = []
    for (let mineLocation of game.mineLocations) {
        const mine = await run.load(mineLocation)
        await mine.sync()
        mines.push(mine)
    }

    if (grid.result === 'won') {
        await game.win(mines)
    } else if (grid.result === 'lost') {
        await game.lose(mines)
    }

    await game.sync()
}