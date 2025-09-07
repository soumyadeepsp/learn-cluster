const url = "mongodb+srv://soumyadeepsp:CodingNinjas1!@learn-cluster.krexlim.mongodb.net/mydb?retryWrites=true&w=majority&appName=learn-cluster";

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to MongoDB successfully!");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});