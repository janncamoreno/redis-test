const mongoose = require('mongoose')

const connect = async function() {
    try{
        mongoose.connect('mongodb://mongo:27017/docker-node-mongo', {
            useNewUrlParser: true
        })
        console.log('>>> DB is connected')
    }catch(e){
        console.log(e.message)
    }
}

module.exports = connect