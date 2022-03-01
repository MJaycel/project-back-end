const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

require('dotenv').config()
require('./db')()

const{ registerUser, loginUser  } = require('./controllers/user_controller')

const{ addEvent, getAllEvents, getEvent,editEvent, deleteEvent } = require('./controllers/event_controller')

const{ addList, getAllToDo, getSingle, editList, deleteList, addItem, editItem } = require('./controllers/todo_controller')

const { getAllVideos, getSingleVideo, addVideo, deleteVideo } = require('./controllers/youtube_controller.js')


//get environment variable but if doesnt exist get 3000
const port = process.env.PORT || 3000

const app = express()
app.use(cors())
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

/////// EVENT ROUTES ////////
app.post('/calendar/add/event/:user_id', addEvent)
app.get('/calendar/:user_id', getAllEvents)
app.get('/calendar/event/:eventId', getEvent)
app.post('/calendar/edit/event/:eventId', editEvent)
app.delete('/calendar/delete/user/:user_id/event/:eventId', deleteEvent)

/////// TO DO ROUTES //////////
app.post('/todo/add/list/:user_id', addList) 
app.get('/todo/:user_id', getAllToDo) 
app.get('/todo/list/:listId', getSingle)
app.post('/todo/edit/list/:listId', editList)
app.delete('/todo/delete/user/:user_id/list/:listId', deleteList)

app.post('/todo/add/user/:user_id/list/:listId', addItem) 
app.post('/todo/edit/user/:user_id/list/:listId/item/:itemId', editItem) 

////-----Youtube Playlist-----////
app.get('/youtube', getAllVideos)
app.get('/youtube/:id', getSingleVideo)
app.post('/youtube', addVideo)
app.delete('/youtube/delete/:id', deleteVideo)






app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})