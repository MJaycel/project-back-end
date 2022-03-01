const Youtube = require('../models/youtube_schema')

const getAllVideos = (req, res) => {
    //get this method in mongoose
    Youtube.find()
    .then((data) => {
        if(data){
            res.status(200).json(data)
            console.log("Hello")
        }
        else{
            res.status(404).json("No Links found")
        }
    })  
    .catch((err) => {
        console.error(err)
        res.status(500).json(err)
    })
}

const getSingleVideo = (req, res) => {

    Youtube.findById(req.params.id)
        .then((data) => {
            if(data){
                res.status(200).json(data)
                console.log("Hello")
            }
            else{
                res.status(404).json(`Video with id: ${req.params.id} not found`)
            }
        })  
        .catch((err) => {
            console.error(err)
            res.status(500).json(err)
        })
    //gets the response and sends it back   
    //res.json(req.params.id)
}

const addVideo = (req, res) => {
    
    let videoData = req.body
    Youtube.create(videoData)
        .then((data) => {
            if(data){
                res.status(201).json(data)
                console.log("Hello")
            }
        })  
        .catch((err) => {
            if(err.name === "ValidationError"){
                res.status(422).json(err)
            }else{}
            
            console.error(err)
            res.status(500).json(err)
        })
}

const deleteVideo = (req, res) => {
    Youtube.findByIdAndDelete(req.params.id)
    .then((data) => {
        if(data){
            res.status(200).json(`Video with id: ${req.params.id} has been deleted`)
        }else{
            res.status(404).json(`Video with id: ${req.params.id} was not found`)
        }
    })
    .catch((err)=> {
        console.error(err)
        res.status(500).json(err)
    })
    
}

module.exports = {
    getAllVideos,
    getSingleVideo,
    addVideo,
    deleteVideo
}

