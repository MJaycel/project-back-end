const { Schema, model } = require("mongoose")

const itemSchema = new Schema({
    item_title: {
        type: String,
    },
    item_note: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    priorityLevel: {
        type: String,
    },
    progress: {
        type: String
    }
})

const todoListsSchema = new Schema({
    theme: {
        type: String
    },
    list_title: {
        type: String,
    },
    items: [ itemSchema ]
},{
    timestamps: true
})

module.exports = model('todoLists', todoListsSchema)
