const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    },
    passwordHash: {
        type: String,
        required: true,
    },
   
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog', // Reference to the Blog model
        },
    ],
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash // Do not reveal the password hash
    },
})

module.exports = mongoose.model('User', userSchema);