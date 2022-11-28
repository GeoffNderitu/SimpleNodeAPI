const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema= new Schema({
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
});

// hashing the password before it's saved
userSchema.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    }catch (error){
        next(error);
    }
})

userSchema.methods.isValidPassword = async function (password) {
    try{
        return await bcrypt.compare(password, this.password);
    }catch(error){
        throw error;
    }
}
//comparing password entered to one in db
userSchema.methods.isValidPassword = async function(password){
    try{
        return await bycrypt.compare(password, this.password);
    }catch(error){ 
        throw error;
    }
}

const User = mongoose.model('user', userSchema);
module.exports = User;