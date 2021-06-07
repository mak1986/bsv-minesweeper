const Run = require('run-sdk')

const { Factory } = require('./factory')

class Purchase extends Run.Jig {
    init(ownerPubkey, buyerPubkey, price) {
        this.owner = ownerPubkey
        this.buyer = buyerPubkey
        this.satoshis = price + Factory.txCost
    }
}

Purchase.deps = {
    Factory
}

module.exports = { Purchase }