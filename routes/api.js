const express = require('express');
const { authSchema } = require('../auth/auth_schema');
const routes = express.Router();
const User = require('../models/user');
const createError = require('http-errors');
const { signAccessToken } = require('../auth/jwtHelper')
//get all list od students from the database
routes.get('/students', (req, res) => {
    res.send({type: 'Get Request'});
});

//add student to the database
routes.post('/students', (req, res) => {
    res.send({type: 'Post Request'});
});

//update student to the database
routes.put('/students/:id', (req, res) => {
    res.send({type: 'Update Request'});
});


//delete a student to the database
routes.delete('/students/:id', (req, res) => {
    res.send({type: 'Delete Request'});
});


// register user
routes.post('/register', async (req, res, next)=>{
    try{
        const {email, password} = req.body;
        const result = await authSchema.validateAsync(req.body);

        const exists = await User.findOne({email: email});
        if(exists) throw createError.Conflict(`${email} has already been registered`);

        const user = new User(result);
        const savedUser = await user.save();
        // res.send(savedUser);
        const accessToken = await signAccessToken(savedUser.id);
        // const refreshToken = await signRefreshToken(savedUser.id);
        res.send({accessToken});
    }catch (error){
        next(error);
    }

});

module.exports = routes;