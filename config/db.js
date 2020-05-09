const mongoose = require("mongoose");

const URI = "mongodb+srv://dbmeostoreadmin:duclinh123@cluster0-nv59m.mongodb.net/dbadminmeostore?retryWrites=true&w=majority";

const connectDB = async () =>{
    const conn = await mongoose.connect(URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};
module.exports = connectDB;