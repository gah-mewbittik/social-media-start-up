const { Schema, model } = require('mongoose');
const { monitorEventLoopDelay } = require('perf_hooks');

//Define reactionSchema as a sub-document
const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    reactionBody: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

//Define thoughtSchema 
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

//getter format for reaction
reactionSchema.virtual('formattedCreatedAt').get(function (){
    return this.createdAt.toLocaleString();
});

////getter format for thought
thoughtSchema.virtual('formattedCreatedAt').get(function (){
    return this.createdAt.toLocaleString();
});

//Counting the reactions
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;