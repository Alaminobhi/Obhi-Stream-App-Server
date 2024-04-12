const mongoose = require('mongoose');

// const uri = "mongodb+srv://<username>:<password>@cluster0.edvmx.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb+srv://alaminobhi2:obhi8032@cluster0.edvmx.mongodb.net/?retryWrites=true&w=majority";

let isConnected = false; // track the connection


const connectToDB = async () => {
    mongoose.set('strictQuery', true);


    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }


    try {
        await mongoose.connect(uri, {
            dbName: "hisab-nikash",
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        })


        isConnected = true;


        console.log('MongoDB connected')
    } catch (error) {
        console.log(error);
    }
}
module.exports = connectToDB;