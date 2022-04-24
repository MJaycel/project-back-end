const { Mongoose } = require('mongoose')

const User = require('../models/user_schema')
const Event = require('../models/event_schema')

////// Add Event
const addEvent = (req,res) => {

    let event = req.body

    User.findByIdAndUpdate(req.params.userId, {$push: {events: event}})
    .then((data) => {
        if(data){
            res.status(200).json(data)
        } else {
            res.status(404).json(`Event not added`)
        }
    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
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

    let eventId = mongoose.Types.ObjectId(req.params.eventId);
    let userId = mongoose.Types.ObjectId(req.params.userId);

    User.aggregate([
        { $match: {_id: userId}},
        {$unwind: '$events'},
        {$match: { 'events._id': eventId}}])
    .then((data) => {
            if(data){
                res.status(200).json(data)
            } else {
                res.status(404).json('Event doesnt exist')
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

    User.findOneAndUpdate({'events._id': id}, 
    {$set: {
        'events.$.title': req.body.title,
        'events.$.description': req.body.description,
        'events.$.startDate': req.body.startDate,
        'events.$.endDate': req.body.endDate,
        'events.$.startTime' : req.body.startTime,
        'events.$.endTime': req.body.endTime,
        'events.$.isComplete': req.body.isComplete,
        'events.$.classes' : req.body.classes,
        'events.$.item_id' : req.body.item_id,      
        'events.$.repeat' : req.body.repeat,
        'events.$.recurrence_pattern' : req.body.recurrence_pattern,
        'events.$.recurring_id' : req.body.recurring_id,
        'events.$.isAllDay' : req.body.isAllDay,
        'events.$.occurs_until' : req.body.occurs_until
        }
    })
    .then((data) => {
        res.status(201).json(data) 
    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

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
            if(data){
                res.status(200).json(data)
            } else{
                res.status(404).json('Event Not Deleted from events table')
            }
    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

const deleteManyEvent = (req,res) => {
    var mongoose = require('mongoose') 

    let userId = mongoose.Types.ObjectId(req.params.user_id);
    let rId = req.params.rId;

    User.updateMany(
        {'_id':userId},
        { $pull : { events: {recurring_id: rId}}}
    )    
    .then((data) => {
        if(data){
            res.status(200).json("EVENT DELETED")
        } else {
            res.status(404).json(`Event not deleted`)
        }            

    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })

}

const UpdateManyEvent = (req,res) => {
    var mongoose = require('mongoose') 

    let rId = req.params.rId;

    User.updateMany({}, {$set: {
        'events.$[i].title': req.body.title,
        'events.$[i].description': req.body.description,
        'events.$[i].startDate': req.body.startDate,
        'events.$[i].endDate': req.body.endDate,
        'events.$[i].startTime' : req.body.startTime,
        'events.$[i].endTime': req.body.endTime,
        'events.$[i].isComplete': req.body.isComplete,
        'events.$[i].classes' : req.body.classes,
        'events.$[i].item_id' : req.body.item_id,      
        'events.$[i].repeat' : req.body.repeat,
        'events.$[i].recurrence_pattern' : req.body.recurrence_pattern,
        'events.$[i].recurring_id' : req.body.recurring_id,
        'events.$[i].isAllDay' : req.body.isAllDay,
        'events.$[i].occurs_until' : req.body.occurs_until
    }},{
        arrayFilters: [{"i.recurring_id": rId}],
        multi: true
    }
    )
    .then((data) => {

        if(data){
            res.status(200).json(data)
        } else{
            res.status(404).json('Events Not Edited')
        }
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
    deleteEvent,
    deleteManyEvent,
    UpdateManyEvent
}