const { Mongoose } = require('mongoose')

const User = require('../models/user_schema')
const ToDo = require('../models/todo_schema')
const { where } = require('../models/user_schema')

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

    ToDo.findByIdAndUpdate({'_id' : id}, {$set: {
        'list_title': req.body.list_title,
        'theme': req.body.theme
    }})
    .then((data) => {
        User.findOneAndUpdate({'todoLists._id': id}, {$set: {
            'todoLists.$.list_title': req.body.list_title,
            'todoLists.$.theme': req.body.theme
        }}, (err, user) => {
            if(user) {
                user.save()
            }
        } )
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
            'todoLists.$[i].items.$[j].item_title': req.body.item_title,
            'todoLists.$[i].items.$[j].item_note': req.body.item_note,
            'todoLists.$[i].items.$[j].startDate': req.body.startDate,
            'todoLists.$[i].items.$[j].endDate': req.body.endDate,
            'todoLists.$[i].items.$[j].startTime': req.body.startTime,
            'todoLists.$[i].items.$[j].endTime': req.body.endTime,
            'todoLists.$[i].items.$[j].isComplete': req.body.isComplete,
            'todoLists.$[i].items.$[j].priorityLevel': req.body.priorityLevel,
            'todoLists.$[i].items.$[j].progress': req.body.progress
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
        //         'items.item_title' : req.body.item_title,
        //         'items.item_note' : req.body.item_note,
        //         'items.startDate' : req.body.startDate,
        //         'items.endDate': req.body.endDate,
        //         'items.startTime' : req.body.startTime,
        //         'items.endTime' : req.body.endTime,
        //         'items.isComplete' : req.body.isComplete,
        //         'items.priorityLevel' : req.body.priorityLevel,
        //         'items.progress' : req.body.progress
        //     }}
        // )
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


    // User.find({_id: userId, todoLists: {_id: listId,items: {_id : itemId}}})
    // .then((data) => {
    //     if(data){
    //         res.status(200).json(data)
    //     } else {
    //         res.status(404).json('item doesnt exist')
    //     }
    // }).catch((err) => {
    //     console.error(err)
    //     res.status(500).json(err)
    // })
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

module.exports = {
    addList,
    getAllToDo,
    getSingle,
    editList,
    deleteList,

    addItem,
    editItem,
    getSingleItem
}