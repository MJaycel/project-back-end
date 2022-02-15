const { Schema, model } = require("mongoose")

const eventsSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
    startDate:{
        type: Date,
    },
    endDate:{
        type: Date,
    },
    // startTime: {
    //     type: Date
    // },
    // endTime: {
    //     type: Date
    // },
    isComplete: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: Schema.Types.ObjectId
    }
})

module.exports = model('events', eventsSchema)