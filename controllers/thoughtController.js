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
            res.json(thought);
        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    },
//Create a thought
async createThought(req, res){
    try{
        const thought = await Thought.create(req.body);

        //update user with new thought
        const user = await User.findOneAndUpdate(
            {username: req.body.username},
            {$push: {thoughts: thought._id}, $inc: {thoughtCount: 1 }},
            {new: true}
        );
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
            {new: true}
            
        );

        if(!thought){
            return res.status(404).json({
                message: 'No user with that ID'
            });
        }
        res.json(thought);
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
        res.json({ message: 'Thought and associated reactions deleted!' });
        //delete user thoughts
        await Thought.deleteMany({_id: {$in: thought.reactions}}) ///this line need to be changed cause of an error to "Reaction"
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},
//Create a reaction TODO: review this   
async createReaction(req, res){
    try{
        // create reaction
        const newReaction = {
            reactionBody: req.body.reactionBody,
            username: req.body.username,
        };

        //find current thought
        const currentThought = await Thought.findById(req.params.thoughtId);
        if(!currentThought){
            return res.status(404).json({message: 'Thought not found'});
        }
        
        //update thought reaction list
        currentThought.reactions.push(newReaction);
        await currentThought.save();

        res.json({message: 'Reaction added successfully', reaction: newReaction});
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},
// Deleting a reaction
async deleteReaction(req, res){
    try{
        const { thoughtId, reactionId} = req.params;

        //find Thought that contains reaction
        const thought = await Thought.findById(thoughtId);

        if(!thought){
            return res.status(404).json({
                message: 'No thought with that ID'
            });
        }
        // get the index of reaction in its array
        const reactionIndex = thought.reactions.findIndex(reaction => reaction._id.toString() === reactionId);

        if(reactionIndex === -1){
            return res.status(404).json({ message: 'No reaction with that ID'});
        }

        //remove reaction
        thought.reactions.splice(reactionIndex, 1);

        //Save
        await thought.save();

        res.json({message: 'Reaction deleted successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
},


};
