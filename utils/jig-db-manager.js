const Run = require('run-sdk')
const { connectToDatabase } = require('./mongodb')

const { SERVER_RUN_PURSE, SERVER_RUN_OWNER, NEXT_PUBLIC_RUN_NETWORK } = process.env

let db

const getDb = async () => {
    if (!db) {
        const connection = await connectToDatabase()
        db = connection.db
    }

    return db
}

const getRun = () => {
    const network = NEXT_PUBLIC_RUN_NETWORK
    const purse = SERVER_RUN_PURSE
    const owner = SERVER_RUN_OWNER

    return new Run({ network, trust: '*', purse, owner })
}

const getClassLocations = async () => {
    const db = await getDb()
    const classes = await db.collection('locations').find({ type: 'class' }).toArray()
    return classes
}

const getInstanceLocations = async (name) => {
    const db = await getDb()
    const instances = await db.collection('locations').find({ type: 'instance', name }).toArray()
    return instances
}

const addGame = async (game) => {
    const db = await getDb()

    await db.collection('locations').insertOne({
        type: 'instance',
        name: 'gameLocation',
        location: { [NEXT_PUBLIC_RUN_NETWORK]: game.location }
    })
}

const addMine = async (mine) => {
    const db = await getDb()

    await db.collection('locations').insertOne({
        type: 'instance',
        name: 'mineLocation',
        location: { [NEXT_PUBLIC_RUN_NETWORK]: mine.location }
    })
}

const addPurchase = async (purchase) => {
    const db = await getDb()

    await db.collection('locations').insertOne({
        type: 'instance',
        name: 'purchaseLocation',
        location: { [NEXT_PUBLIC_RUN_NETWORK]: purchase.location }
    })
}

module.exports = {
    getRun,
    getClassLocations,
    getInstanceLocations,
    addGame,
    addMine,
    addPurchase
}