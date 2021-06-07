const Run = require('run-sdk')

const { expect } = Run.extra

class Game extends Run.Jig {

    init(id, player, mineLocations, reward){
        this.id = id
        this.player = player
        this.mineLocations = mineLocations
        this.satoshis = reward
        this.result = null
    }

    win(mines){
        expect(this.result).toBe(null)

        for(let mine of mines){
            mine.incrementLosses()
        }

        this.result = 'won'
        this.owner = this.player
    }

    lose(mines){
        expect(this.result).toBe(null)

        const satoshis = parseInt(this.satoshis/mines.length)

        for(let mine of mines){
            mine.incrementWins()
            mine.deposit(satoshis)
        }

        this.result = 'won'
        this.satoshi = 0
        this.destroy()
    }

    withdraw(){
        expect(this.owner).toEqual(this.player)

        this.satoshis = 0
        this.destroy()
    }
}


Game.deps = {
    expect
}

module.exports = {
    Game
}