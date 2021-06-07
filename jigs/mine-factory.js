const Run = require('run-sdk')

const { Group } = Run.extra

const { Factory } = require('./factory')
const { Mine } = require('./mine')

class MineFactory extends Factory {

    init(ownerPubkey, priceSatoshis) {
        super.init(ownerPubkey, priceSatoshis)
        this.numberOfMines = 0
    }

    produce(purchase) {

        this.numberOfMines = this.numberOfMines + 1

        const mine = new Mine(this.numberOfMines, new Group([this.owner, purchase.buyer], 1))

        this.satoshis = 0

        purchase.destroy()

        return mine
    }
}

MineFactory.deps = {
    Group,
    Mine
}

module.exports = { MineFactory }