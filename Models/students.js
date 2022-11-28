const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    firstname:{
        type: String,
        require:[true, 'First name is required']
    },
    lastname: {
        type: String,
        required: [true, 'Last Name is required']
    },
    gender: {
        type: String,
        require: [true, 'Gender is required']
    }
});

const Student = mongoose.model('student', StudentSchema );

