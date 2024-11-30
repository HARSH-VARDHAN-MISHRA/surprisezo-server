const mongoose = require("mongoose")

const connectDb = async()=>{
    try {
        await mongoose.connect("mongodb+srv://mannu22072000:XAalFCkVepzvsf6E@cluster0.ayr9h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Database Connected Successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {connectDb}