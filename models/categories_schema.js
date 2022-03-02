const { Schema, model } = require("mongoose")

const audioSchema = new Schema({
    title: {
        type: String,
    },
    artist: {
        type: String
    },
    duration: {
        type: String
    },
    category:{
        type: String
    },
    cover_image: {
        type: String
    },
    path: {
        type: String
    }
})

const categorySchema = new Schema({
    category: {
        type: String
    },
    audios: [ audioSchema ]
})

module.exports = model('categories', categorySchema)