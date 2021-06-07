const Run = require('run-sdk')

const { expect, Group } = Run.extra

class Mine extends Run.Jig {

    init(id, owner) {
        this.id = id
        this.owner = owner
        this.enabled = false
        this.wins = 0
        this.losses = 0
    }

    deposit(satoshis) {
        expect(satoshis).toBeGreaterThan(0)

        this.satoshis = this.satoshis + satoshis
    }

    withdraw(satoshis) {
        expect(this.satoshis).toBeGreaterThanOrEqualTo(satoshis)

        this.satoshis = this.satoshis - satoshis
    }

    enable() {
        this.enabled = true
    }

    disable() {
        this.enabled = false
    }

    send(pubkey) {
        this.owner = new Group([this.owner.pubkeys[0], pubkey], 1)
    }

    incrementWins() {
        this.wins = this.wins + 1
    }

    incrementLosses() {
        this.losses = this.losses + 1
    }
}

Mine.deps = {
    expect,
    Group
}

module.exports = {
    expect,
    Group,
    Mine
}