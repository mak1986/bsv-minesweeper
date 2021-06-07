const Run = require('run-sdk')
const { connectToDatabase } = require('./mongodb')

const { SERVER_RUN_PURSE, SERVER_RUN_OWNER, NEXT_PUBLIC_RUN_NETWORK } = process.env

const getDb = async () => {
    if (!db) {
        const connection = await connectToDatabase()
        db = connection.db
    }

    return db
}

// class DatabaseStateCache {
//     async get(location) {
//         // console.log('DatabaseStateCache get', location)
//         // Return an entry to location, or undefined
//         const db = await getDb()
//         const object = await db.collection('cache').findOne({ location })
//         return object && object.value ? JSON.parse(object.value) : undefined
//     }
//     async set(location, value) {
//         // console.log('DatabaseStateCache set', location, value)
//         const db = await getDb()
//         const query = { location }
//         const update = { $set: { location, value: JSON.stringify(value) } }
//         const option = { upsert: true }

//         await db.collection('cache').updateOne(query, update, option)
//     }
// }

// const cache = new DatabaseStateCache()


let db



const getRun = () => {
    const network = NEXT_PUBLIC_RUN_NETWORK
    const purse = SERVER_RUN_PURSE
    const owner = SERVER_RUN_OWNER

    return new Run({ network, trust: '*', purse, owner }) //cache
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