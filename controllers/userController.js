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
        //find current User
        const currentUser = await User.findById(req.params.userId);
        if(!currentUser){
            return res.status(404).json({ message: 'User not found'});
        }

        //find friend user
        const friendUser = await User.findById(req.params.friendsId);
        if(!friendUser){
            return res.status(404).json({message: ' Friend not found'});
        }

        //check if friend already in user's friend list
        if(currentUser.friends.includes(friendUser._id)){
            return res.status(400).json({message: 'User is already friends with this user'});
        }
        // update user's friend list
        currentUser.friends.push(friendUser._id);
        await currentUser.save();
        
        //update friend's friend list
        friendUser.friends.push(currentUser._id);
        await friendUser.save();

        res.json({message: 'Friend added successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},
// Deleting a friend
async deleteFriend(req, res){
    try{
         //find current User
         const currentUser = await User.findById(req.params.userId);
         if(!currentUser){
             return res.status(404).json({ message: 'User not found'});
         }
 
         //find friend user
         const friendUser = await User.findById(req.params.friendsId);
         if(!friendUser){
             return res.status(404).json({message: ' Friend not found'});
         }

         // check if friend is in user's friend list
         const friendIndex = currentUser.friends.indexOf(friendUser._id);
         if(friendIndex === -1){
            return res.status(400).json({ message: 'Friend not found in list'})
         }
         //Remove friend from user's list
         currentUser.friends.splice(friendIndex, 1);
         await currentUser.save();

         //check if user exist in friends' list
         const userIndex = friendUser.friends.indexOf(currentUser._id);
         if(userIndex === -1){
            return res.status(400).json({ message: 'User not found in list'})
         }
         //Remove user form friend's list
         friendUser.friends.splice(userIndex, 1);
         await friendUser.save();

         res.json({ message:'Friend deleted successfully'});

    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},

};
