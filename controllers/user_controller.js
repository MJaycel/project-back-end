const { Mongoose } = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user_schema')

//// Register User  
const registerUser = (req, res) => {
    // let newUser = new User(req.body)

    var value = 8
    let newUser = new User()

    newUser.name = req.body.name
    newUser.email = req.body.email
    newUser.password = req.body.password

    if(newUser.password !== ''){
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
            return res.json(user)
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
        })
}

module.exports = {
    registerUser,
    loginUser,

}