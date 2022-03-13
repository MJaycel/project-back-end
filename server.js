const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

require('dotenv').config()
require('./db')()

const{ registerUser, loginUser  } = require('./controllers/user_controller')

const{ addEvent, getAllEvents, getEvent,editEvent, deleteEvent } = require('./controllers/event_controller')

const{ addList, getAllToDo, getSingle, editList, deleteList, addItem, editItem, getSingleItem, deleteItem } = require('./controllers/todo_controller')

const {addCategory, getAllCat, addAudios, getAllAudios, getSingleAudio} = require('./controllers/audios_controller')

const {addAudio, getAll, getAudio} = require('./controllers/medi_audios_controller')

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
// app.get('/todo/list/:listId', getSingle)
app.get('/todo/user/:userId/list/:listId', getSingle)

app.post('/todo/edit/list/:listId', editList)
app.delete('/todo/delete/user/:user_id/list/:listId', deleteList)

app.post('/todo/add/user/:user_id/list/:listId', addItem) 
app.post('/todo/edit/user/:user_id/list/:listId/item/:itemId', editItem) 
app.get('/todo/user/:userId/list/:listId/item/:itemId', getSingleItem)
app.delete('/todo/delete/user/:userId/list/:listId/item/:itemId', deleteItem)



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