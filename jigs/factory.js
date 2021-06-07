const Run = require('run-sdk')

const { expect } = Run.extra

class Factory extends Run.Jig {

    init(ownerPubkey, priceSatoshis) {
        this.owner = ownerPubkey
        this.priceSatoshis = priceSatoshis
    }

    setPriceSatoshis(priceSatoshis){
        this.priceSatoshis = priceSatoshis
    }

    produce(purchase) {
        expect(purchase.owner).toEqual(this.owner)
        expect(purchase.satoshis).toBeGreaterThanOrEqualTo(this.priceSatoshis + Factory.txCost)
    }

    deposit(satoshis) {
        expect(satoshis).toBeGreaterThan(0)

        this.satoshis = this.satoshis + satoshis
    }

    withdraw(satoshis){
        expect(this.satoshis).toBeGreaterThanOrEqualTo(satoshis)

        this.satoshis = this.satoshis - satoshis
    }
}


Factory.txCost = 600

Factory.deps = {
    expect
}

module.exports = { Factory }