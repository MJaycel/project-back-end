const { Schema, model } = require("mongoose")

//validates email syntax
const validator = require('validator')

const bcrypt = require('bcrypt')


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
    isComplete: {
        type: Boolean,
        default: false
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    repeat: {
        type: Boolean,
        default: false
    }
    // user_id: {
    //     type: Schema.Types.ObjectId
    // }
})


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

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        unique: true,
        lowercase:true,
        trim:true,
        validate:[validator.isEmail, 'Invalid email'],
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        // unique: true,
        // trim: true,
        minLength: [8, "Password must be at least 8 characters"],
        required: [true, "Password is required"]
    },
    events: [ eventsSchema ],
    todoLists: [ todoListsSchema ]
}, {
    timestamps: true
})

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password, function(result){
        return result
    })
}
module.exports = model('user', userSchema)
