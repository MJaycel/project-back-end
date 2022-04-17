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
    },
    recurrence_pattern: {
        type: String
    },
    classes: {
        type: String
    },
    item_id :{
        type: String
    },
    recurring_id: {
        type: String
    },
    isAllDay: {
        type: Boolean,
        default: false
    },
    occurs_until: {
        type: Date
    }
    // user_id: {
    //     type: Schema.Types.ObjectId
    // }
})

const youtubeSchema = new Schema({

    youtube_link:{
        type: String,
        required: [true, 'Youtube Link is required']
    },
    video_title:{
        type: String,
        required: [true, 'Video Title is required']
    }
    // user_id: {
    //     type: Schema.Types.ObjectId
    // }
})

const subTaskSchema = new Schema({
    title: {
        type: String,
    },
    startDate: {
        type: Date,
        default: null
    },
    classes: {
        type: String
    },
    inCalendar: {
        type: Boolean,
        default: false
    },
    isComplete: {
        type: Boolean,
        default: false
    }
})


const itemSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
    startDate: {
        type: Date,
        default: null
    },
    startTime: {
        type: String
    },
    endDate: {
        type: Date,
        default: null
    },
    classes: {
        type: String
    },
    inCalendar: {
        type: Boolean,
        default: false
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    priorityLevel: {
        type: String,
        default: 'Medium Priority'
    },
    progress: {
        type: String,
        default: 'Not Started'
    },
    archived: {
        type: Boolean,
        default: false
    },
    subTask: [ subTaskSchema ]
})

const todoListsSchema = new Schema({
    theme: {
        type: String
    },
    list_title: {
        type: String,
    },
    archived: {
        type: Boolean,
        default: false
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
