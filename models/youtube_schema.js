const { Schema, model } = require('mongoose')

const youtubeSchema = new Schema({

    youtube_link:{
        type: String,
        required: [true, 'Youtube Link is required']
    },
    video_title:{
        type: String,
        required: [true, 'Video Title is required']
    }
})

module.exports = model('Youtube', youtubeSchema)