const { Schema, model } = require("mongoose")

const itemSchema = new Schema({
    item_title: {
        type: String,
    },
    item_note: {
        type: String
    },
    start: {
        type: Date
    },
    end: {
        type: Date
    },
    isComplete: {
        type: Boolean,
        default: false
    }
})

const todoListsSchema = new Schema({
    list_title: {
        type: String,
    },
    items: [ itemSchema ]
},{
    timestamps: true
})

module.exports = model('todoLists', todoListsSchema)
