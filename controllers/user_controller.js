const { Mongoose } = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user_schema')

//// Register User  
const registerUser = (req, res) => {
    // let newUser = new User(req.body)

    let newUser = new User()

    newUser.name = req.body.name
    newUser.email = req.body.email
    newUser.password = req.body.password

    if(newUser.password.length >= 8){
        newUser.password = bcrypt.hashSync(req.body.password, 10)
    }

    //save user to db
    newUser.save((err, user) => {
        if(err) {
            return res.status(422).send({
               message: err
            })
        } else {
            // user.password = undefined
                     //create token
            res.json({
                token: jwt.sign({
                    name: user.name,
                    email: user.email,
                _id: user._id
                }, 'professional_project'),
                user
            })
            // return res.json(user)

        }
    })
}

//// Login User
const loginUser = (req,res) => {
     User.findOne({
         email: req.body.email
     }).then(user => {
         //if user blank or wrong password 
         if(!user || !user.comparePassword(req.body.password)){
            return res.status(401).json({
                message: "Authentication failed. Invalid user or password"
            })
         } 
         //create token
         res.json({
             token: jwt.sign({
                 name: user.name,
                 email: user.email,
                _id: user._id
             }, 'professional_project'),
             user
         })

     })
    .catch(err => {
        throw err
        // return res.status(401).json()
    })
}

const getSingleUser = (req,res) => {
    User.findById(req.params.id)
        .then((data)=> {
            if(data){
                res.status(200).json(data)
            }else{
                res.status(404).json(`User with id: ${req.params.id} is not found`)
            }
        })
        .catch((err)=> {
            console.error(err)
            res.status(500).json(err)
        })
}


module.exports = {
    registerUser,
    loginUser,
    getSingleUser
}