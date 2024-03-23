const { User, Thought } = require('../models');

module.exports = {
//Get All users
async getUsers(req, res){
    try{
        const users = await User.find();
        res.json(users);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},
// Get an individual user
 async getOneUser(req, res){
        try{
            const user = await User.findOne({
                _id: req.params.userId
            })
            .select('-__v');
            res.json(user);
        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    },
//Create a user
async createUser(req, res){
    try{
        const user = await User.create(req.body);
        res.json(user);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},
//Update a User
async updateUser(req, res){
    try{
        const user = await User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {new: true}
            
        );

        if(!user){
            return res.status(404).json({
                message: 'No user with that ID'
            });
        }
        res.json(user);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},
// Deleting a user
async deleteUser(req, res){
    try{
        const user = await User.findOneAndDelete({
            _id: req.params.userId
        });

        if(!user){
            return res.status(404).json({
                message: 'No user with that ID'
            });
        }
        res.json({ message: 'User and associated thoughts deleted!' });
        //delete user thoughts
        await Thought.deleteMany({_id: {$in: user.thoughts}}) 
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},
//Create a friend   
async createFriend(req, res){
    try{
        const friend = await User.create(req.body);
        res.json(friend);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},
// Deleting a friend
async deleteFriend(req, res){
    try{
        const user = await User.findOneAndDelete({
            _id: req.params.userId
        });

        if(!user){
            return res.status(404).json({
                message: 'No user with that ID'
            });
        }
        //delete user thoughts TODO: Do i need below??
        // await Thought.deleteMany({_id: {$in: user.thoughts}}) 
        // res.json({ message: 'User and associated apps deleted!' })
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},

};
