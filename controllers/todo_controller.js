const { Mongoose } = require('mongoose')

const User = require('../models/user_schema')
const ToDo = require('../models/todo_schema')
const { where } = require('../models/user_schema')
const Event = require('../models/event_schema')
const{ addEvent } = require('./event_controller')


const addList = (req,res) => {
    const list = new ToDo()

    list.list_title = req.body.list_title
    list.items = req.body.items
    list.theme = req.body.theme

    list.save()
    .then((data) => {
        User.findById(req.params.user_id, (err,users) => {

            if(users) {
                users.todoLists.push(list)
                users.save()
                res.status(201).json(data)            
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
const getAllToDo = (req,res) => {

    User.findById(req.params.user_id)
    .then((data) => {
        if(data){
            res.status(200).json(data.todoLists)
        } else {
            res.status(404).json('User has no events')
        }
    }).catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

///// Get single to do list
const getSingle = (req,res) => {
    var mongoose = require('mongoose')

    let listId = mongoose.Types.ObjectId(req.params.listId);
    let userId = mongoose.Types.ObjectId(req.params.userId);


    // ToDo.findById({'_id': id})
    // .then((data) => {
    //     if(data){
    //         res.status(200).json(data)
    //     } else {
    //         res.status(404).json('List doesnt exist')
    //     }
    // }).catch((err) => {
    //     console.error(err)
    //     res.status(500).json(err)
    // })
    User.findOne({_id: userId}, {'todoLists': {$elemMatch: {'_id': listId}}})
    .then((data) => {
        if(data){
            res.status(200).json(data.todoLists)
        } else {
            res.status(404).json('List doesnt exist')
        }
    }).catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

////// Edit list
const editList = (req,res) => {
    var mongoose = require('mongoose')

    let id = mongoose.Types.ObjectId(req.params.listId);

    // ToDo.findByIdAndUpdate({'_id' : id}, {$set: {
    //     'list_title': req.body.list_title,
    //     'theme': req.body.theme
    // }})
    User.findOneAndUpdate({'todoLists._id': id}, {$set: {
        'todoLists.$.list_title': req.body.list_title,
        'todoLists.$.theme': req.body.theme
    }})
    .then((data) => {

        if(data){
            res.status(200).json(data)
        } else {
            res.status(404).json(`List not updated`)
        }
    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

//////// delete list

const deleteList = (req,res) => {
    var mongoose = require('mongoose') 

    let userId = mongoose.Types.ObjectId(req.params.user_id);

    let id = mongoose.Types.ObjectId(req.params.listId);

    User.updateOne(
            {'_id':userId},
            { $pull : { todoLists: {_id: id}}}
        )
    .then((data) => {
        ToDo.findByIdAndRemove({'_id': id}, (err) => {
            if(err){
                res.status(404).json('List Not Deleted')
            } else{
                res.status(200).json(data)
            }
        })
    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

///// Archive List
const archiveList = (req,res) => {
    var mongoose = require('mongoose')

    let id = mongoose.Types.ObjectId(req.params.listId);

    User.findOneAndUpdate({'todoLists._id': id}, {$set: {
        'todoLists.$.archived': req.body.archived,
    }})
    .then((data) => {

        if(data){
            res.status(200).json(data)
        } else {
            res.status(404).json(`List not archived`)
        }
    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

////// Add item in list
const addItem = (req,res) => {

    let item = req.body

    var userId = req.params.user_id
    var listId = req.params.listId

    // ToDo.findByIdAndUpdate({'_id': listId}, {$push: {
    //     'items' : item
    // }})
    User.findOneAndUpdate(
        {_id: userId, "todoLists._id" : listId }, 
        { $push: {'todoLists.$.items': item} })
    .then((data) => {
        if(data){
            res.status(200).json(data)
        } else {
            res.status(404).json(`Item not added`)
        }
    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

const editItem = (req,res) => {
    var mongoose = require('mongoose')

    var userId = mongoose.Types.ObjectId(req.params.user_id)
    var listId = mongoose.Types.ObjectId(req.params.listId)
    var itemId = mongoose.Types.ObjectId(req.params.itemId)

    User.findByIdAndUpdate(
        {_id: userId},
        {$set: {
            'todoLists.$[i].items.$[j].title': req.body.title,
            'todoLists.$[i].items.$[j].description': req.body.description,
            'todoLists.$[i].items.$[j].startDate': req.body.startDate,
            'todoLists.$[i].items.$[j].inCalendar': req.body.inCalendar,
            'todoLists.$[i].items.$[j].endDate': req.body.endDate,
            'todoLists.$[i].items.$[j].startTime': req.body.startTime,
            'todoLists.$[i].items.$[j].endTime': req.body.endTime,
            'todoLists.$[i].items.$[j].isComplete': req.body.isComplete,
            'todoLists.$[i].items.$[j].priorityLevel': req.body.priorityLevel,
            'todoLists.$[i].items.$[j].progress': req.body.progress,
            'todoLists.$[i].items.$[j].classes': req.body.classes,
            'todoLists.$[i].items.$[j].archived': req.body.archived,
            }
        },
        {
            arrayFilters: [
                { 'i._id' : listId},
                {'j._id' : itemId}
            ]
        }
    )
    .then((data) => {
        // ToDo.findByIdAndUpdate(
        //     {_id: listId},
        //     {$set: {
        //         'items.title' : req.body.title,
        //         'items.description' : req.body.description,
        //         'items.startDate' : req.body.startDate,
        //         'items.endDate': req.body.endDate,
        //         'items.startTime' : req.body.startTime,
        //         'items.endTime' : req.body.endTime,
        //         'items.isComplete' : req.body.isComplete,
        //         'items.priorityLevel' : req.body.priorityLevel,
        //         'items.progress' : req.body.progress
        //     }}
        // )
        // if(req.body.inCalendar === true){
        //     addInCal(data)
        // }
        if(data){
            res.status(200).json(data)
        }else{
            res.status(404).json(`item not updated`)
        }
    }) .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

const getSingleItem = (req,res) => {
    var mongoose = require('mongoose')

    let listId = mongoose.Types.ObjectId(req.params.listId);
    let userId = mongoose.Types.ObjectId(req.params.userId);
    let itemId = mongoose.Types.ObjectId(req.params.itemId);

    User.aggregate([
        { $match: {_id: userId}},
        {$unwind: '$todoLists'},
        {$match: { 'todoLists._id': listId}},
        {$unwind: '$todoLists.items'},
        {$match: {'todoLists.items._id': itemId}}])
    .then((data) => {
            if(data){
                res.status(200).json(data)
            } else {
                res.status(404).json('item doesnt exist')
            }
        }).catch((err) => {
            console.error(err)
            res.status(500).json(err)
        })
}

const deleteItem = (req,res) => {
    var mongoose = require('mongoose') 

    let userId = mongoose.Types.ObjectId(req.params.userId);
    let listId = mongoose.Types.ObjectId(req.params.listId);
    let itemId = mongoose.Types.ObjectId(req.params.itemId);


    User.updateOne(
            {'_id':userId, 'todoLists._id': listId},
            { $pull : { "todoLists.$.items": {_id: itemId}}}
        )
    .then((data) => {
        if(data){
            res.status(200).json(data)
        } else{
            res.status(404).json('Item Not Deleted')
        }
    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

const archiveItem = (req,res) => {
    var mongoose = require('mongoose')

    var userId = mongoose.Types.ObjectId(req.params.user_id)
    var listId = mongoose.Types.ObjectId(req.params.listId)
    var itemId = mongoose.Types.ObjectId(req.params.itemId)

    User.findByIdAndUpdate(
        {_id: userId},
        {$set: {
            'todoLists.$[i].items.$[j].archived': req.body.archived,
            }
        },
        {
            arrayFilters: [
                { 'i._id' : listId},
                {'j._id' : itemId}
            ]
        }
    )
    .then((data) => {
        if(data){
            res.status(200).json(data)
        }else{
            res.status(404).json(`item not updated`)
        }
    }) .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

const addSubTask = (req,res) => {
    let subTask = req.body

    var userId = req.params.user_id
    var listId = req.params.listId
    var itemId = req.params.itemId

    User.findOneAndUpdate(
        {_id: userId, "todoLists._id" : listId }, 
        { $push:
            {
                'todoLists.$.items.$[j].subTask': subTask
            } 
        },
        {
            arrayFilters: [
                {'j._id' : itemId}
            ]
        }
    )
    .then((data) => {
        if(data){
            res.status(200).json(data)
        } else {
            res.status(404).json(`SubTask not added`)
        }
    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })  
}

const editSubTask = (req,res) => {
    var mongoose = require('mongoose')

    var userId = mongoose.Types.ObjectId(req.params.user_id)
    var listId = mongoose.Types.ObjectId(req.params.listId)
    var itemId = mongoose.Types.ObjectId(req.params.itemId)
    var subTaskId = mongoose.Types.ObjectId(req.params.subTaskId)

    User.findByIdAndUpdate(
        {_id: userId},
        {$set: {
            'todoLists.$[i].items.$[j].subTask.$[k].title': req.body.title,
            'todoLists.$[i].items.$[j].subTask.$[k].startDate': req.body.startDate,
            'todoLists.$[i].items.$[j].subTask.$[k].inCalendar': req.body.inCalendar,
            'todoLists.$[i].items.$[j].subTask.$[k].isComplete': req.body.isComplete,
            'todoLists.$[i].items.$[j].subTask.$[k].classes': req.body.classes,
            }
        },
        {
            arrayFilters: [
                { 'i._id' : listId},
                {'j._id' : itemId},
                {'k._id': subTaskId}
            ]
        }
    )
    .then((data) => {
        if(data){
            res.status(200).json(data)
        }else{
            res.status(404).json(`item not updated`)
        }
    }) .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })    
}

const deleteSubTask = (req,res) => {
    var mongoose = require('mongoose') 

    let userId = mongoose.Types.ObjectId(req.params.userId);
    let listId = mongoose.Types.ObjectId(req.params.listId);
    let itemId = mongoose.Types.ObjectId(req.params.itemId);
    let subTaskId = mongoose.Types.ObjectId(req.params.subTaskId)


    User.updateOne(
            {'_id':userId},
            { $pull : { 
                "todoLists.$[j].items.$[k].subTask": {_id: subTaskId}
                }
            },
            {
                arrayFilters: [
                    {'j._id' : listId},
                    {'k._id': itemId}
                ]
            }
        )
    .then((data) => {
        if(data){
            res.status(200).json(data)
        } else{
            res.status(404).json('SubTask Not Deleted')
        }
    })        
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}
 
module.exports = {
    addList,
    getAllToDo,
    getSingle,
    editList,
    deleteList,
    archiveList,

    addItem,
    editItem,
    getSingleItem,
    deleteItem,
    archiveItem,

    addSubTask,
    editSubTask,
    deleteSubTask
}