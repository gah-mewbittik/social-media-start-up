const { User, Thought } = require('../models');

module.exports = {
//Get All thoughts
async getThoughts(req, res){
    try{
        const thoughts = await Thought.find();
        res.json(thoughts);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},
// Get an individual thought
 async getOneThought(req, res){
        try{
            const thought = await Thought.findOne({
                _id: req.params.thoughtId
            })
            .select('-__v');
        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    },
//Create a thought
async createThought(req, res){
    try{
        const thought = await Thought.create(req.body);
        res.json(thought);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},
//Update a thought
async updateThought(req, res){
    try{
        const thought = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$set: req.body},
            //TODO: do I need more??
        );

        if(!thought){
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
// Deleting a thought
async deleteThought(req, res){
    try{
        const thought = await Thought.findOneAndDelete({
            _id: req.params.thoughtId
        });

        if(!thought){
            return res.status(404).json({
                message: 'No user with that ID'
            });
        }
        //delete user thoughts
        await Thought.deleteMany({_id: {$in: user.thoughts}}) //TODO: review if this done properly
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

};
