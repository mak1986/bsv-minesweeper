const Run = require('run-sdk')

const { expect } = Run.extra
const { Factory } = require('./factory')
const { Game } = require('./game')

class GameFactory extends Factory {

    init(ownerPubkey, priceSatoshis) {
        super.init(ownerPubkey, priceSatoshis)
        this.numberGames = 0
    }

    produce(purchase, mines) {
        super.produce(purchase)

        const playerEntryFee = this.priceSatoshis
        const mineEntryFee = parseInt(playerEntryFee / mines.length)
        const totalEntryFee = playerEntryFee + (mineEntryFee * mines.length)
        const gameFee = parseInt(totalEntryFee * GameFactory.gameFee)
        const reward = totalEntryFee - gameFee

        const mineLocations = []

        for (let mine of mines) {
            mineLocations.push(mine.location)
            mine.withdraw(mineEntryFee)
        }

        this.numberGames = this.numberGames + 1

        const game = new Game(this.numberGames, purchase.buyer, mineLocations, reward)

        this.satoshis = 0

        purchase.destroy()

        return game
    }

}


GameFactory.gameFee = 0.1

GameFactory.deps = {
    expect,
    Game
}

module.exports = { GameFactory }