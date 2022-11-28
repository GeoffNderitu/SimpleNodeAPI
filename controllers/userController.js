const express = require('express');
const { authSchema } = require('../auth/auth_schema');
const User = require('../models/User');
const createError = require('http-errors')
const { signAccessToken } = require('../auth/jwtHelper')

module.exports ={
    register: async (req, res, next)=>{
        try{
            const {email, password} = req.body;
            const result = await authSchema.validateAsync(req.body);
    
            const exists = await User.findOne({email: email});
            if(exists) throw createError.Conflict(`${email} has already been registered`);
    
            const user = new User(result);
            const savedUser = await user.save();
            res.send(savedUser);
            const accessToken = await signAccessToken(savedUser.id);
            // const refreshToken = await signRefreshToken(savedUser.id);
            // res.send({accessToken,refreshToken});
        }catch (error){
            next(error);
        }
    
    },
    login: async (req, res, next)=>{
        try{
            const result = await authSchema.validateAsync(req.body);
            const user = await User.findOne({email: result.email});
            if(!user) throw creatError.NotFound('User not registered');
            
            const isMatch = await user.isValidPassword(result.password);
            if(!isMatch) throw creatError.Unauthorized('username/password is not valid');
    
            const accessToken = await signAccessToken(user.id);
            const refreshToken = await signRefreshToken(user.id);
            // res.send(result);
            res.send({ accessToken, refreshToken });
        }catch(error){
             if(error.isJoi === true) return next(creatError.BadRequest('Invalid username/password'));
             next(error);
        }
    },
    refreshToken: async (req, res, next)=>{
        try{
            const { refreshToken } = req.body;
            if(!refreshToken)throw creatError.BadRequest();
            const userId = await verifyRefreshToken(refreshToken);
            
            const accessToken = await signAccessToken(userId);
            const refToken = await signRefreshToken(userId);
            res.send({accessToken:accessToken, refreshToken:refToken});
        }catch(error){
            next(error);
    
        }
    }
}