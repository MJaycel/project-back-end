const mongoose = require('mongoose')

const init = () => {
    //to get errors
    mongoose.set('debug', true)

    mongoose.connect(process.env.DB_ATLAS_URL,{
        useNewUrlParser:true,
    })
    .catch((err) => {
        console.error('error: ' + err.stack)
        process.exit(1)
    })

    mongoose.connection.on('open', () => {
        console.log('connected to database')
    })
}

mongoose.Promise = global.Promise

module.exports = init