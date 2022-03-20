const { Schema, model } = require("mongoose")

const audiosSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    artist: {
        type: String
    },
    duration: {
        type: String
    },
    category:{
        type: String
        // id: {
        //     type: Schema.Types.ObjectId,
        //     // ref: "category"
        // },
        // cat_name: {
        //     type: String
        // }
    },
    cover_image: {
        type: String
    },
    html_link:{
        type: String
    }
})

module.exports = model('audios', audiosSchema)