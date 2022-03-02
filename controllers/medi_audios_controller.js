const { Mongoose } = require('mongoose')
const mediAudioSchema = require('../models/meditation_audios_schema.js')

const Audio = require('../models/meditation_audios_schema.js')


///////////////// ADD AUDIO ///////////////////////// 

const addAudio = (req,res) => {
    let audio = req.body

    Audio.create(audio)
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

/////////////////////// GET ALL /////////////////


const getAll = (req,res) => {
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

/////////////////////// GET SINGLE /////////////////


const getAudio = (req,res) => {
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
    addAudio,
    getAll,
    getAudio
}

////////////////////////////////////////////////////////////////