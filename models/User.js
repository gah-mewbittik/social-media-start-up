const { Schema, model } = require('mongoose');

//regex for email validation
const regexEmail = `/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/`;

////Schema to create User model
const userSchema= new Schema(
    {
        username: { 
            type: String, unique: true, 
            required: [true, 'User email is required'], 
            trimmed: true, 
            match: [regexEmail, 'Please enter valid email address'] 
        },
        email: {
            type: String, 
            unique: true, 
            required: true, 
        },
        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'Thought',
        },
        ],
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        ],   
    },
    {   //We want to create virtual called friendCount that gets the length of user's friends array
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

//create virtual called friendCount that gets the length of user's friends array
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

// Initialize our User model
const User = model('user', userSchema);

module.exports = User;