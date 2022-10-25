let mongoose = require('mongoose');
require('dotenv').config();

class Database {
    constructor() {
        this._connect();
    }
    _connect() {
        mongoose.connect(process.env.MONGO_URI)
        .then(docs=>{
            console.log("Database connection successful");
        })
        .catch(err=>{
            console.log("Database connection error");
            console.log(err);
        });
    }
}

module.exports = new Database();