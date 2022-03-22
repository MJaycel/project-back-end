const { Mongoose } = require('mongoose')
const audios_schema = require('../models/audios_schema.js')

const Audio = require('../models/audios_schema.js')
const Category = require('../models/categories_schema.js')
const users_scheme = require('../models/user_schema.js')



///////////////// ADD CATEGORY ///////////////////////// 

const addCategory = (req,res) => {
    let category = req.body

    Category.create(category)
        .then((data) => {
            if(data){
                res.status(201).json(data)
            }
        })
        .catch((err)=> {
            console.error(err)
            res.status(500).json("None Found")
        })
}

/////////////////////// GET BY CATEGORY /////////////////


const getAllCat = (req,res) => {
    Category.find()
        .then((data) => {
            if(data){
                res.status(200).json(data)
            }
            else {
                res.status(404).json("None found")
            }
        })
        .catch((err)=> {
            console.error(err)
            res.status(500).json("None Found")
        })
}


///////////////////////// ADD SONGS /////////////////////

const addAudios = (req,res) => {

    // var mongoose = require('mongoose')

    // let audio = req.body
    const audio = new Audio()

    audio.title = req.body.title
    audio.artist = req.body.artist
    audio.duration = req.body.duration
    audio.category = req.body.category
    audio.cover_image = req.body.cover_image
    audio.html_link = req.body.html_link

    // let id = mongoose.Types.ObjectId(req.body.category);
    // Audio.create(audio)
    audio.save()
    .then((data) => {
        Category.findOne({category: req.body.category }, (err,category) => {

            if(category) {
                category.audios.push(audio)
                category.save()
                res.status(201).json("Audio created")            
            }
        })
    }).catch((err) => {
        console.error(err)
        res.status(500).json("Unsucccesful")
    })

    // REFFERENCE
    // https://stackoverflow.com/questions/34985846/mongoose-document-references-with-a-one-to-many-relationship
}

/////////////////////////// GET ALL SONGS /////////////////// 

const getAllAudios = (req,res) => {
    Audio.find()
        .then((data) => {
            if(data){
                res.status(200).json(data)
            }
            else {
                res.status(404).json("None found")
            }
        })
        .catch((err)=> {
            console.error(err)
            res.status(500).json("None Found")
        })
}

////////////////////// GET AUDIO BY CATEGORY ////////////////

const getSingleAudio = (req,res) => {
    Audio.findById(req.params.id)
        .then((data)=> {
            if(data){
                res.status(200).json(data)
            }else{
                res.status(404).json(`Audio with id: ${req.params.id} is not found`)
            }
        })
        .catch((err)=> {
            console.error(err)
            res.status(500).json(err)
        })
}

////////////////////////// EXPORTS /////////////////////////////
 
module.exports = {
    addCategory,
    getAllCat,
    addAudios,
    getAllAudios,
    getSingleAudio
}

////////////////////////////////////////////////////////////////