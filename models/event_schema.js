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
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    classes: {
        type: String
    },
    repeat: {
        type: Boolean,
        default: false
    },
    recurrence_pattern: {
        type: String
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: Schema.Types.ObjectId
    },
    item_id: {
        type: String
    },
    recurring_id: {
        type: String
    }
})

module.exports = model('events', eventsSchema)