const { Mongoose } = require('mongoose')

const User = require('../models/user_schema')
const Event = require('../models/event_schema')

////// Add Event
const addEvent = (req,res) => {
    const event = new Event()

    event.title = req.body.title
    event.description = req.body.description
    event.startDate = req.body.startDate
    event.endDate = req.body.endDate
    event.startTime = req.body.startTime
    event.endTime = req.body.endTime
    event.isComplete = req.body.isComplete
    event.user_id = req.params.user_id

    event.save()
    .then((data) => {
        User.findById(req.params.user_id, (err,users) => {

            if(users) {
                users.events.push(event)
                users.save()
                res.status(201).json("Event created", data)            
            }
        })
    }).catch((err) => {
        console.error(err)
        res.status(500).json("Unsucccesful")
    })

//     // REFFERENCE
//     // https://stackoverflow.com/questions/34985846/mongoose-document-references-with-a-one-to-many-relationship
}

////// Get All Events
const getAllEvents = (req,res) => {

    User.findById(req.params.user_id)
    .then((data) => {
        if(data){
            res.status(200).json(data.events)
        } else {
            res.status(404).json('User has no events')
        }
    }).catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}


////// Get single Event
const getEvent = (req,res) => {

    var mongoose = require('mongoose')

    let id = mongoose.Types.ObjectId(req.params.eventId);

    Event.findById({'_id': id})
    .then((data) => {
        if(data){
            res.status(200).json(data)
        } else {
            res.status(404).json('User has no events')
        }
    }).catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}


//////// Edit Event
const editEvent = (req,res) => {

    var mongoose = require('mongoose')

    let id = mongoose.Types.ObjectId(req.params.eventId);


    Event.findByIdAndUpdate({'_id' : id}, {$set: {
        'title': req.body.title,
        'description': req.body.description,
        'startDate': req.body.startDate,
        'endDate': req.body.endDate,
        'startTime' : req.body.startTime,
        'endTime': req.body.endTime,
        'isComplete': req.body.isComplete
    }})
    .then((data) => {
        User.findOneAndUpdate({'events._id': id}, {$set: {
            'events.$.title': req.body.title,
            'events.$.description': req.body.description,
            'events.$.startDate': req.body.startDate,
            'events.$.endDate': req.body.endDate,
            'events.$.startTime' : req.body.startTime,
            'events.$.endTime': req.body.endTime,
            'events.$.isComplete': req.body.isComplete           
        }}, (err, user) => {
            if(user){
                user.save()
            }
        })
        res.status(201).json(data) 
    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}


////// Weekly Event


/////// Delete Event

const deleteEvent = (req,res) => {

    var mongoose = require('mongoose') 

    let userId = mongoose.Types.ObjectId(req.params.user_id);

    let id = mongoose.Types.ObjectId(req.params.eventId);

    User.updateOne(
            {'_id':userId},
            { $pull : { events: {_id: id}}}
        )
    .then((data) => {
        Event.findByIdAndRemove({'_id': id}, (err) => {
            if(err){
                res.status(404).json('Event Not Deleted from events table')
            } else{
                res.status(200).json(data)
            }
        })
        // if(data){
        //     res.status(200).json("EVENT DELETED")
        // } else {
        //     res.status(404).json(`Event not deleted`)
        // }            

    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

module.exports = {
    addEvent,
    getAllEvents,
    getEvent,
    editEvent,
    deleteEvent
}