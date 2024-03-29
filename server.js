const express = require('express')
// const cors = require('cors')
const jwt = require('jsonwebtoken')

require('dotenv').config()
require('./db')()

const{ registerUser, loginUser, getSingleUser, editUser, getAllUsers  } = require('./controllers/user_controller')

const{ addEvent, getAllEvents, getEvent,editEvent, deleteEvent,deleteManyEvent, UpdateManyEvent } = require('./controllers/event_controller')

const{ addList, getAllToDo, getSingle, editList, deleteList,archiveList ,addItem, editItem, getSingleItem, deleteItem, archiveItem, addSubTask, editSubTask, deleteSubTask } = require('./controllers/todo_controller')

const {addCategory, getAllCat, addAudios, getAllAudios, getSingleAudio} = require('./controllers/audios_controller')

const {addAudio, getAll, getAudio} = require('./controllers/medi_audios_controller')

const { getAllVideos, getSingleVideo, addVideo, deleteVideo } = require('./controllers/youtube_controller.js')

//get environment variable but if doesnt exist get 3000
const port = process.env.PORT || 3000

const app = express()

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))
// app.use(cors())
app.use(express.json())

// verify Token
app.use((req,res,next)=> {
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] ==='Bearer'){
        jwt.verify(req.headers.authorization.split(' ')[1], 'professional_project', (err,decode) => {
            if(err)
                req.user = undefined
                req.user = decode

            next()
        })
    } else{
        req.user = undefined
        next()
    }
})

///////////////// ROUTES //////////////////////
app.get('/', (req,res) => {
    res.json('Hello World')
}) 

//////// USER ROUTES /////////
app.post('/register', registerUser)
app.post('/login', loginUser)
app.get('/user/:id',getSingleUser)
app.post('/edit/user/:id',editUser)
app.get('/users',getAllUsers)



/////// EVENT ROUTES ////////
app.post('/calendar/add/event/:userId', addEvent)
app.get('/calendar/:userId', getAllEvents)
// app.get('/calendar/event/:eventId', getEvent)
app.get('/calendar/user/:userId/event/:eventId', getEvent)

app.post('/calendar/edit/event/:eventId', editEvent)
app.delete('/calendar/delete/user/:userId/event/:eventId', deleteEvent)
app.delete('/calendar/delete/many/user/:userId/event/:rId', deleteManyEvent)
app.post('/calendar/edit/many/event/:rId', UpdateManyEvent)



app.post('/todo/add/list/:userId', addList) 
app.get('/todo/:userId', getAllToDo) 
// app.get('/todo/list/:listId', getSingle)
app.get('/todo/user/:userId/list/:listId', getSingle)

app.post('/todo/edit/list/:listId', editList)
app.delete('/todo/delete/user/:userId/list/:listId', deleteList)
app.post('/todo/archive/list/:listId', archiveList)

app.post('/todo/add/user/:userId/list/:listId', addItem) 
app.post('/todo/edit/user/:userId/list/:listId/item/:itemId', editItem) 
app.get('/todo/user/:userId/list/:listId/item/:itemId', getSingleItem)
app.delete('/todo/delete/user/:userId/list/:listId/item/:itemId', deleteItem)
app.post('/todo/archive/user/:userId/list/:listId/item/:itemId', archiveItem) 
app.post('/todo/add/user/:userId/list/:listId/item/:itemId', addSubTask)
app.post('/todo/edit/user/:userId/list/:listId/item/:itemId/subTask/:subTaskId', editSubTask) 
app.delete('/todo/delete/user/:userId/list/:listId/item/:itemId/subTask/:subTaskId', deleteSubTask)





app.post('/category',addCategory)
app.post('/songs', addAudios)
app.get('/category', getAllCat)
app.get('/songs', getAllAudios)
app.get('/songs/:id', getSingleAudio)


app.post('/meditation', addAudio)
app.get('/meditation', getAll)
app.get('/meditation/:id', getAudio)

////-----Youtube Playlist-----////
app.get('/youtube/:user_id', getAllVideos)
app.get('/youtube/:video_id', getSingleVideo)
app.post('/youtube/add/:user_id', addVideo)
app.delete('/youtube/delete/:id', deleteVideo)









app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})