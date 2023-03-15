const fs=require('fs');
const express=require("express");
const exp = require('constants');
const dotenv=require('dotenv');
const mongoose=require('mongoose');


const app=express();
app.use(express.json());

dotenv.config({path:'./config.env'});


const db=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.set('strictQuery',false);
mongoose.connect(db,{
    useNewUrlParser:true
    
}).then(()=> console.log("Mongoose connected....")).catch(err=>{
    console.log(err);
});








const user_router=require("./user.js");
const tour_router=require('./tours.js');

app.use("/tours",tour_router);
app.use("/users",user_router);



// tour_router.route("/").get(get_all_tours).post(create_tour);
// tour_router.route("/:id").get(get_tour).patch(change_tour).delete(delete_tour);

// user_router.route("/").get(get_all_users).post(create_user);

app.listen(3000,()=>{
    console.log("Server is running...");
})






