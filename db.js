const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/temp')
.then(()=>{
    console.log("MongoDB Connected");
})
.catch((error)=>{
    console.log("Failed connection");
})

