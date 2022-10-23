let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    log: [{
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
        
    }]
});

module.exports = mongoose.model('User',userSchema);
