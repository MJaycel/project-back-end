const { Schema, model } = require("mongoose")

const mediAudioSchema = new Schema({
    title: {
        type: String,
    },
    duration: {
        type: String
    },
    description: {
        type: String
    },
    cover_image: {
        type: String
    },
    html_link: {
        type: String
    }
})

module.exports = model('meditation_audios', mediAudioSchema)