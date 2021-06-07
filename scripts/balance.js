
const { outputBalance } = require('./common')
const { getRun } = require('./deploy')



const balance = async () => {

    const { server } = getRun()

    outputBalance('server balance', server)
}



balance()